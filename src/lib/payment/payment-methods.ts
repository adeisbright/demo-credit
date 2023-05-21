import ITransaction from "./transaction.interface"

interface IPaymentMethods {
    makePayment : (email : string , transactionData : ITransaction) => {} 
    verifyPayment : (transactionID : string) => {} 
}

export default IPaymentMethods