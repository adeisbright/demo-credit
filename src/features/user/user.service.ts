import knexClient from "../../loader/knex-loader";

interface User {
    id ?: number
    first_name: string 
    last_name: string 
    email: string 
    password : string 
}

type UserType = User | undefined 

/**
 * @description Queries the user table to find a particular user that matches the query param
 * @param queryParam {Object} 
 * @returns {Object}
 * @example await getUser({email : john@doe.com})
 */

export const getUser = async (queryParam : Record<string,any>) => {
    try {
        const user : UserType = await knexClient<User>("users")
            .where(queryParam)
            .first()
        
        if (!user) {
            throw new Error("User not found")
        }
        const {password , first_name , last_name , email , id} = user 
        return {
            hasError: false,
            message: "Query successful",
            data: {
                password,
                first_name,
                last_name,
                email,
                id
            }
        }
    } catch (error: any) { 
       
        return {
            hasError: true,
            message: error.message,
            data: {
               password :"",
                first_name : "",
                last_name : "",
                email : "",
                id : null
            }
        }
    }
}

/**
 * @description Creates the user and also automatically creates a wallet for the user 
 * The balance on the wallet is set to 0 by default
 * @param userData 
 * @returns 
 */
export const addUser = async (userData: Record<string, any>) => {
    const transaction = await knexClient.transaction()
    try {
        const user = await knexClient<User>("users")
            .transacting(transaction)
            .insert(userData)
            .returning(["first_name", "last_name", "id"])
        
        const userId = user[0].id
        
        await knexClient("wallets")
            .transacting(transaction)
            .insert({
                userId
            })
        await transaction.commit() 

        return {
            hasError: false,
            message: "Query successful",
            data : user[0]
        }
       
    } catch (error: any) {
        await transaction.rollback()
        return {
            hasError: true,
            message: error.message,
            data : {}
        }
    }
}