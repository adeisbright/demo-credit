import app from "./app"
import Config from "./config";
import Constant from "./constant";
import knexClient from "./loader/knex-loader";

interface User {
    id: number;
    email: string;
    first_name: string;
    age : number 
}


(async () => {
    //Doing Transaction 
    const transaction = await knexClient.transaction()
    try {
        //Create a user
        await knexClient("users")
            .transacting(transaction)
            .insert({
                first_name: "Joshua", 
                last_name: "Selman", 
                password: "cheap",
                email: "sogbon@email.@iti.com",
                created_at: new Date(),
                updated_at : new Date() 
            })
            .onConflict("email")
            .ignore()
        
        // Update the another user 
        await knexClient("users")
            .transacting(transaction)
            .where("id", 19)
            .update({
                "full_name" : "Edited2"
            })
            .returning(["id" , "first_name" , "last_name"])
        
        await transaction.commit()

    } catch (error: any) {
        await transaction.rollback()
        console.log(error)
    }
})()


app.listen(Config.serverPort, () =>
    console.log(Constant.messages.serverUp)
);