import fileLogger from "../../common/logging/error-logger"
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


export const getTransactions = async (
    userId: number,
    limit: number, 
    offset : number
) => {
    try {
   
        const transactions = await knexClient.raw(
            `
            SELECT CONCAT(sender.first_name ,'   ',  sender.last_name) AS sender_name , 
            CONCAT(receiver.first_name , '   ' ,  receiver.last_name) AS receiver_name , 
            transactions.amount , transactions.sender_id , transactions.recipient_id,
            transactions.transaction_date , transactions.reference, transaction_types.title 
            AS transaction_type , transactions.id As transaction_id
            FROM transactions INNER JOIN users sender 
            ON 
            (transactions.sender_id = sender.id AND transactions.sender_id = ? ) OR 
            (transactions.sender_id = sender.id AND transactions.recipient_id = ?)
            INNER JOIN users receiver ON transactions.recipient_id = receiver.id 
            INNER JOIN transaction_types 
            ON transactions.transaction_type_id = transaction_types.id 
            LIMIT ? OFFSET ? 
            `, [userId , userId , limit , offset]
        )
        
        if (!transactions) {
            throw new Error("Unable to retrieve transactions")
        }
        return {
            hasError: false, 
            message: "Ok", 
            data: transactions.rows
        }
    } catch (error: any) {
        console.log(error)
        return {
            hasError: true,
            message: error.message, 
            data: { }
        }
    }
}

export const getTransaction = async (
    transactionId: number
) => {
    try {
   
        const transactions = await knexClient.raw(
            `
            SELECT CONCAT(sender.first_name ,'   ',  sender.last_name) AS sender_name , 
            CONCAT(receiver.first_name , '   ' ,  receiver.last_name) AS receiver_name , 
            transactions.amount , transactions.sender_id , transactions.recipient_id,
            transactions.transaction_date , transactions.reference, transaction_types.title 
            AS transaction_type , transactions.id As transaction_id

            FROM transactions 
            INNER JOIN users sender   ON transactions.sender_id = sender.id 
            INNER JOIN users receiver ON transactions.recipient_id = receiver.id 
            INNER JOIN transaction_types 
            ON transactions.transaction_type_id = transaction_types.id 
            WHERE transactions.id = ?
            `, [transactionId]
        )
       
        if (!transactions || transactions.rows.length === 0 ) {
            throw new Error("Transaction not found")
        }
        return {
            hasError: false, 
            message: "Ok", 
            data: transactions.rows
        }
    } catch (error: any) {
        fileLogger.log({
            level: "error",
            message : error.message
        })
        return {
            hasError: true,
            message: error.message, 
            data: { }
        }
    }
}