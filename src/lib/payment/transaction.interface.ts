
export default interface ITransaction {
    sender_id: number, 
    recipient_id : number,
    transactionRef : string ,
    amount : number,
    payment_processor_id : number,
    transactionDate ?: Date,
    transaction_type_id : number
    currency ?: string 
}

