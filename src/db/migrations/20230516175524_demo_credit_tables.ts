import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("users", function (table: any) {
            table.increments("id");
            table.string("first_name", 60).notNullable();
            table.string("last_name", 60).notNullable();
            table.string("email").notNullable();
            table.string("password").notNullable()
            table.timestamps()
        })
        .createTable("wallets", function (table: any) {
            table.increments("id");
            table.double("balance");
            table.integer("userId").unsigned().notNullable() 

            table.foreign("userId").references("id").inTable("users")
            table.timestamps()
        })
        .createTable("payment_processors", function (table: any) {
            table.increments("id");
            table.string("processor_name");
             table.timestamps()
        })
        .createTable("transaction_types", function (table: any) {
            table.increments("id");
            table.string("title" , 60);
            table.text("description");
             table.timestamps()
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
            table.timestamps()
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
             table.timestamps() 
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema 
        .dropTable("users")
        .dropTable("wallets")
        .dropTable("transactions")
        .dropTable("transaction_types")
        .dropTable("user_bank_accounts")
        .dropTable("payment_processors")
}

