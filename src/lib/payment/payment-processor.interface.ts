export default interface IPaymentProcessor{
    name : string,
    status ?: string
}

export interface IPaymentProcessorUpdate{
    status ?: string 
    name ?: string
}