import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("users", function (table: any) {
            table.increments("id");
            table.string("first_name", 60).notNullable();
            table.string("last_name", 60).notNullable();
            table.string("email").notNullable();
            table.string("password").notNullable()
            table.timestamps(true , true)
        })
        .createTable("wallets", function (table: any) {
            table.increments("id");
            table.double("balance").defaultTo(0.0);
            table.integer("userId").unsigned().notNullable() 

            table.foreign("userId").references("id").inTable("users")
            table.timestamps(true , true)
        })
        .createTable("payment_processors", function (table: any) {
            table.increments("id");
            table.string("processor_name");
           table.timestamps(true , true)
        })
        .createTable("transaction_types", function (table: any) {
            table.increments("id");
            table.string("title" , 60);
            table.text("description");
            table.timestamps(true , true)
        })
        .createTable("transactions", function (table: any) {
            table.primary([
                "id",
                "sender_id",
                "recipient_id",
                "transaction_type_id",
                "processor_id"
            ]);

            table.increments("id");
            table.string("status", 20);
            table.string("reference");
            table.double("amount");
            table.dateTime("transaction_date");
            table.integer("sender_id").unsigned().notNullable(); 
            table.integer("recipient_id").unsigned().notNullable();
            table.integer("transaction_type_id").unsigned().notNullable()
            table.integer("processor_id").unsigned().notNullable()
            
            table.foreign("sender_id").references("id").inTable("users")
            table.foreign("recipient_id").references("id").inTable("users")
            table.foreign("transaction_type_id").references("id").inTable("transaction_types") 
            table.foreign("processor_id").references("id").inTable("payment_processors")  
           table.timestamps(true , true)
        })
    
         .createTable("user_bank_accounts", function (table: any) {
            table.primary([
                "id",
                "user_id",
            ]);

            table.increments("id");
            table.string("bank_name", 100);
            table.string("account_number" , 10);
            table.integer("user_id").unsigned().notNullable(); 
            
             table.foreign("user_id").references("id").inTable("users") 
            table.timestamps(true , true)
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema 
        
        .dropTable("user_bank_accounts")
        .dropTable("wallets")
         .dropTable("transactions")
        .dropTable("users")
        .dropTable("transaction_types")
        .dropTable("payment_processors")
}

