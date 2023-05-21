import knexClient from "../../loader/knex-loader"
import FlutterwavePay from "../../lib/payment/flutterwave-pay"
import paystackPay from "../../lib/payment/paystack-pay" 
import ITransaction from "../../lib/payment/transaction.interface"

export const findPaymentProcessors = async () => {
    try {
        interface IPaymentProcessor {
            id: number 
            processor_name: string,
            is_active : boolean
        }
        const tableFields = ["id" , "processor_name"]
        const processors = await knexClient<IPaymentProcessor>("payment_processors")
            .where({
                is_active : true
            })
            .select(...tableFields)
            
            .returning(tableFields)
        
        return {
            data: processors, 
            hasError: false, 
            message : "Ok"
        }
    } catch (error: any) {
        console.log(error)
        return {
            data: [],
            hasError: true,
            message : error.message
        }
    }
}

export const findPaymentProcessor = async (id : number) => {
    interface IPaymentProcessor {
        id: number 
        processor_name: string,
        is_active : boolean
    }
    try {
        
        const tableFields = ["id" , "processor_name" , "is_active"]
        const processor = await knexClient<IPaymentProcessor>("payment_processors")
            .where({
                id, 
                is_active : true
            })
            .select(...tableFields)
            .returning(tableFields)
            .first()
        
        if (!processor) {
            throw new Error("Processor not found")
        }
        return {
            data: {
                id: processor.id,
                name: processor.processor_name,
                is_active : processor.is_active
            }, 
            hasError: false, 
            message : "Ok"
        }
    } catch (error: any) {
        console.log(error)
       
        return {
            data : {},
            hasError: true,
            message : error.message
        }
    }
}

export const getBalance = async (userId : number) => {
    try {
        const tableFields = ["userId" , "balance"]
        const balance = await knexClient("wallets")
                .where({userId})
                .select(...tableFields)
                .returning(tableFields)
                .first()
        
        return {
            data: balance, 
            hasError: false, 
            message : "Ok"
        }
    } catch (error: any) {
        console.log(error)
        return {
            data: [],
            hasError: true,
            message : error.message
        }
    }
}


/**
 * @description Generates a payment link that the user can use in making 
 * payment. 
 * @param {String} email email address of the payer
 * @param {Objectt} transactionData an object with data about the transaction
 * @param {String} processorType name of the payment processor to use
 * @returns {String} a payment string 
 */
export const generatePaymentLink = async (
    email: string,
    transactionData: ITransaction,
    processorType: string
): Promise<Record<string,any>> => {
    try {
        if (processorType === "paystack") {
           
            return {
                hasError: false,
                message: "Ok", 
                data : await paystackPay.makePayment(email, transactionData)
            }
        } else if (processorType = "flutterwave") {
            return {
                hasError: false,
                message: "Ok", 
                data : await FlutterwavePay.makePayment(email, transactionData)
            }
        }
        throw new Error("Wahala")
    } catch (error : any) {
        return {
            hasError: true,
            message: error.message, 
            data : ""
        }
    }
}
 

export const  confirmPayment = async (
    transactionId : string , 
    isRef : boolean
) => {
    try{
        if (isRef !== undefined && isRef){
            return paystackPay.verifyPayment(transactionId)
        }
        return FlutterwavePay.verifyPayment(transactionId)
    }catch(error : any){
        return {
            status : 400,
            message : error.message
        }
    }
}