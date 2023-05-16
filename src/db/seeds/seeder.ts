import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    await knex("payment_processors").insert([
        { processor_name: "flutterwave" },
        {processor_name: "paystack" }
    ]);

    await knex("transaction_types").insert([
        { title: "fund"  , description : "Add money to a wallet"},
        { title: "transfer", description: "Send money to another wallet" },
        { title: "reversal", description: "Return a previously transferred money" },
        { title: "withdrawal", description: "Remove money from a wallet" },
    ]);

};
