import knex from "knex"
import Config from "../config"

const {host , databaseName , port , password , user, client} = Config.database

const knexClient = knex({
    client,
    connection: {
        host,
        database: databaseName, 
        port,
        user,
        password
    },
    pool: {
        min: 0, 
        max : 10
    }
})

export default knexClient

