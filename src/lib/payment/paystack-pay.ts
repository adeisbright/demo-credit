import Config from "../../config";
import ITransaction from "./transaction.interface";
import axios from "axios"; 
import IPaymentMethods from "./payment-methods";

const headers  = {
    Authorization : `Bearer ${Config.paymentProcessors.paystack.secretKey}`,
    'Content-Type' : "application/json"
}

class PaystackPay implements IPaymentMethods {

    makePayment = async (email: string, transactionData: ITransaction) => {
    
        const paystackTransactionUrl = Config.paymentProcessors.paystack.transactionURL 
        const {
            reference,
            amount,
            currency,
            sender_id, 
            recipient_id,
            payment_processor_id,
            transaction_type_id
        } = transactionData

        const paymentData = { 
            email, 
            currency,
            amount: Number(amount)*100 ,
            reference: reference,
            metadata: {
                sender_id, 
                recipient_id,
                payment_processor_id,
                transaction_type_id
            },
            callback_url : Config.paymentProcessors.paystack.callbackURL
        }

        const result =  await axios.post(paystackTransactionUrl , paymentData , {
            headers
        })

        return result.data.data.authorization_url
    };

    /**
     * @description verifies if a payment was successful 
     * @param transactionId 
     * @returns 
     */
    verifyPayment = async (transactionId: string) => {
        const verificationUrl = `${Config.paymentProcessors.paystack.verificationURL}/${transactionId}`
        const verify = await axios.get(verificationUrl,{headers})
        return verify.data
    };

} 

export default new PaystackPay()