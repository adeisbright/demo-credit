import Config from "../../config";
import ITransaction from "./transaction.interface";
import axios from "axios"; 
import IPaymentMethods from "./payment-methods";

const headers  = {
    Authorization : `Bearer ${Config.paymentProcessors.fluttwave.secretKey}`,
    'Content-Type' : "application/json"
}

class FlutterwavePay implements IPaymentMethods {

    makePayment = async (email: string, transactionData: ITransaction) => {

        const {
            transactionRef,
            amount,
            currency,
            sender_id, 
            recipient_id,
            payment_processor_id,
            transaction_type_id
        } = transactionData
        const paymentUrl = Config.paymentProcessors.fluttwave.paymentURL 

        const data = {
            tx_ref : transactionRef,
            amount ,
            currency,
            customer:{
                "email": email,
            },
            meta: {
                sender_id, 
                recipient_id,
                payment_processor_id,
                transaction_type_id
            },
            redirect_url : Config.paymentProcessors.fluttwave.callbackURL
        }

        const result =  await axios.post(paymentUrl , data , {
            headers
        })
        
        return result.data.data.link
    };

    verifyPayment =  async (transactionId: string) => {
        try{
            const verificationUrl = `${Config.paymentProcessors.fluttwave.transactionsURL}/${transactionId}/verify`
            const verify = await axios.get(verificationUrl,{headers})
            return verify.data
        }catch(error : any){
            return {
                status : 400,
                message : error.message 
            }
        }
    };
} 

export default new FlutterwavePay()