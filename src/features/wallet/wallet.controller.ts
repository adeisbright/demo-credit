import { Request , Response , NextFunction } from "express";
import ApplicationError from "../../common/error-handler/ApplicationError";

import {
    findPaymentProcessors,
    getBalance,
    findPaymentProcessor,
    generatePaymentLink,
    confirmPayment,
    transferFund
} from "./wallet.service";
import { getUser } from "../user/user.service";
import NotFoundError from "../../common/error-handler/NotFoundError";
import BadRequestError from "../../common/error-handler/BadRequestError";
import {v4 as referenceGenerator} from "uuid"
import ITransaction from "../../lib/payment/transaction.interface";
import { addTransaction, getTransactionTypeId } from "../transaction/transaction.service";

export const getPaymentProcessors = async (
    _ : Request,
    res : Response,
    next : NextFunction
) => {
    try{
      
        const savedProcessors = await findPaymentProcessors() 
        if (savedProcessors.hasError) {
            throw new Error(savedProcessors.message)
        }
        if (savedProcessors.data.length === 0){
            return res.status(200).json({
                message : "No processors available",
                success  :true , 
                statusCode : 200,
                body : []
            })
        }
       
        return res.status(200).json({
            message : "See list of processors",
            success  :true , 
            statusCode : 200,
            body : savedProcessors.data
        })
        
    }catch(error  :any){
        return next(new ApplicationError(error.message))
    }
}

export const getBalanceHandler = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try{
        const userId = Number(req.params.userId)
        const user = await getUser({ id: userId }) 
        if (user.hasError) {
            return next(new NotFoundError(user.message))
        }
        const userBalance = await getBalance(userId)   
        res.status(200).json({
            message : "Balance obtained successfully",
            success  :true , 
            statusCode : 200,
            data : userBalance.data
        })
    }catch(error  :any){
        return next(new ApplicationError(error.message))
    }
}

export const generatePaymentLinkHandler = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try{

        const { amount, payment_processor_id } = req.body 
        const user = res.locals.payload
        if (!user.email) {
            return next(new BadRequestError("Your  email account is not verified yet"))
        }
        
        const processor = await findPaymentProcessor(payment_processor_id)
        if (processor.hasError) {
            return next(new NotFoundError(processor.message))
        }

        if (!processor){
            return next(new NotFoundError("Processor not found or it is inactive"))
        }

        const transactionType = await getTransactionTypeId("fund")
        if (transactionType.hasError) {
            return next(new NotFoundError(transactionType.message))
        }

        const reference = referenceGenerator()

        const transactionData: ITransaction = { 
            sender_id: user.id, 
            recipient_id : user.id ,
            reference ,
            currency : "NGN" ,
            amount,
            payment_processor_id,
            transaction_type_id : transactionType.data.id as number 
        }
        const paymentLink = await generatePaymentLink(user.email ,transactionData ,  processor.data.name as string)
        if (paymentLink.hasError) {
            return next(new BadRequestError(paymentLink.message))
        }
        
        res.status(200).send({
            statusCode : 200,
            success : true , 
            message : "Redirect user to the link given below",
            body : paymentLink.data
        })
    } catch (error: any) {
        console.log(error)
        return next(new ApplicationError(error.message))
    }
}

export const verifyFlutterwavePayment = async (
    _ : Request,
    res : Response,
    next : NextFunction
) => {
    try {

        const result  = await confirmPayment(res.locals.transactionId, false)
        if (result.status === 400) {
            return res.send("Sorry, there is an issue with confirming this payment. Contact Support")
        }
        const customerEmail = result.data.customer.email 

        console.log(result)

        const user = await getUser({email : customerEmail})
        if (user.hasError) {
            return next(new NotFoundError(user.message))
        }
        
        const transactionData = {
            reference: result.data.tx_ref, 
            sender_id: user.data.id,
            recipient_id: user.data.id, 
            transaction_type_id: result.data.meta.transaction_type_id, 
            amount: result.data.amount_settled,
            transaction_date: result.data.created_at,
            processor_id : result.data.meta.payment_processor_id
        }
        
        await addTransaction(transactionData)
        
        res.send("Payment Completed")
            
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}

export const verifyPaystackPayment = async (
    _ : Request,
    res : Response,
    next : NextFunction
) => {
    try {

        const result  = await confirmPayment(res.locals.transactionId, true)
        if (result.status === 400) {
            return res.send("Sorry, there is an issue with confirming this payment. Contact Support")
        }
        const customerEmail = result.data.customer.email 

        const user = await getUser({email : customerEmail})
        if (user.hasError) {
            return next(new NotFoundError(user.message))
        }
        
        const transactionData = {
            reference: result.data.reference, 
            sender_id: result.data.metadata.sender_id,
            recipient_id: result.data.metadata.recipient_id, 
            transaction_type_id: result.data.metadata.transaction_type_id, 
            amount: result.data.amount/100,
            transaction_date: result.data.created_at,
            processor_id : result.data.metadata.payment_processor_id
        }
        
        await addTransaction(transactionData)
        
        res.send("Payment Completed")
            
    } catch (error: any) {
        console.log(error)
        return next(new ApplicationError(error))
    }
}

export const fundWalletHandler = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try{
        const userId = Number(req.params.userId)
        const user = await getUser({ id: userId }) 
        if (user.hasError) {
            return next(new NotFoundError(user.message))
        }
        const userBalance = await getBalance(userId)   
        res.status(200).json({
            message : "Balance obtained successfully",
            success  :true , 
            statusCode : 200,
            data : userBalance.data
        })
    }catch(error  :any){
        return next(new ApplicationError(error.message))
    }
}

export const withdrawalHandler = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try{
        const userId = Number(req.params.userId)
        const user = await getUser({ id: userId }) 
        if (user.hasError) {
            return next(new NotFoundError(user.message))
        }
        const userBalance = await getBalance(userId)   
        res.status(200).json({
            message : "Balance obtained successfully",
            success  :true , 
            statusCode : 200,
            data : userBalance.data
        })
    }catch(error  :any){
        return next(new ApplicationError(error.message))
    }
}

export const transferHander = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try {
        const { amount, recipient_id } = req.body 
        
        const userId = Number(res.locals.payload.id)
        const [sender, recipient] = await Promise.all([
            getUser({ id: userId }),
            getUser({ id: recipient_id })
        ])

        if (sender.hasError) {
            return next(new NotFoundError(sender.message))
        }
        if (recipient.hasError) {
            return next(new NotFoundError("Recipient not found"))
        }

        const senderBalance = await getBalance(userId)   
        if (senderBalance.data.balance < amount) {
            return next(new BadRequestError("Insufficient Balance"))
        }

        const transactionType = await getTransactionTypeId("transfer")
        if (transactionType.hasError) {
            return next(new NotFoundError(transactionType.message))
        }

        const reference = referenceGenerator()

        const transactionData: ITransaction = { 
            sender_id: sender.data.id as number, 
            recipient_id : recipient.data.id  as number ,
            reference ,
            amount,
            payment_processor_id : 1,
            transaction_type_id: transactionType.data.id as number,
            transaction_date : new Date()
        }

        const transaction = await transferFund(transactionData)
        if (transaction.hasError) {
            throw new Error(transaction.message)
        }
        res.status(200).json({
            message : "Transaction successful",
            success  :true , 
            statusCode : 200,
            data: transaction.data
        })
    }catch(error  :any){
        return next(new ApplicationError(error.message))
    }
}