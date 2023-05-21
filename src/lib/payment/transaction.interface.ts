
export default interface ITransaction {
    sender_id: number, 
    recipient_id : number,
    reference : string ,
    amount : number,
    payment_processor_id : number,
    transaction_date ?: Date,
    transaction_type_id : number
    currency ?: string 
}

