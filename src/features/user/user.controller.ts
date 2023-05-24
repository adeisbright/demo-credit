import { Request, Response, NextFunction } from "express"; 
import ApplicationError from "../../common/error-handler/ApplicationError";
import { getTransaction, getTransactions } from "../transaction/transaction.service";
import HTTPQueryParser from "../../lib/http-query-parser";
import NotFoundError from "../../common/error-handler/NotFoundError";


export const createUser = async(
    _: Request, 
    res: Response, 
    next : NextFunction
) => {
    try {
        res.json({
            status: true,
            statusCode: 200,
            message: "Successful",
            data : {}
        })
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}

export const getTransactionsHandler  = async(
    req: Request, 
    res: Response, 
    next : NextFunction
) => {
    try {
        const userId = Number(req.params.userId) 
        const { size, skip } = HTTPQueryParser(req.query)
      
        const transactions = await getTransactions(userId , size , skip)

        if (transactions.hasError) {
            throw new Error(transactions.message)
        }

        res.json({
            status: true,
            statusCode: 200,
            message: transactions.data.length > 0 ? "Transactions retrieved successfully" : "No Transaction found",
            data: transactions.data
        })
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}

export const getTransactionHandler = async(
    req: Request, 
    res: Response, 
    next : NextFunction
) => {
    try {
        const transactionId = Number(req.params.transactionId)  
      
        const transaction = await getTransaction(transactionId)

        if (transaction.hasError) {
           return next(new NotFoundError(transaction.message))
        }

        res.json({
            status: true,
            statusCode: 200,
            message: "Transaction retrieved successfully",
            data: transaction.data
        }) 
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}