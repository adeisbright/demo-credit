import knexClient from "../../loader/knex-loader"

interface IWallet {
    userId: number, 
    balance : number 
}
export const addTransaction = async (transactionData: Record<string, any>) => {
    const transaction = await knexClient.transaction()
    try {
        const { sender_id , amount } = transactionData
        
        await knexClient("transactions")
            .transacting(transaction)
            .insert(transactionData)
        
        const updateUserBalance = await knexClient<IWallet>("wallets")
            .where({ userId: sender_id })
            .increment("balance", amount)
            .returning(["balance"])

        if (!updateUserBalance) {
            throw new Error("No wallet found for this user")
        }

        await transaction.commit()
        return {
            hasError: false, 
            message: "Ok", 
            data : updateUserBalance[0].balance
        }
    } catch (error: any) {
        console.log(error)
        await transaction.rollback()
        return {
            hasError: true,
            message: error.message, 
            data : {}
        }
    }
}

export const getTransactionTypeId = async (title : string) => {
    try {
        
        interface ITransactionType {
            id: number 
            title : string 
        }

        const tableFields = ["id" , "title"]
        const transactionType = await knexClient<ITransactionType>("transaction_types")
            .select(...tableFields)
            .where({ title })
            .returning(tableFields)
            .first()

      
        return {
            hasError: false, 
            message: "Ok", 
            data: {
                id : transactionType?.id
            }
        }
    } catch (error: any) {
        console.log(error)
        return {
            hasError: true,
            message: error.message, 
            data: {
                id : ""
            }
        }
    }
}