import type { Knex } from "knex";
import * as dotenv from "dotenv"
dotenv.config({path : "../../.env"})

const config: { [key: string]: Knex.Config } = {
  development: {
    client : process.env.DB_CLIENT,
    connection: {
          host : process.env.DB_HOST , 
          database: process.env.DATABASE, 
          port : Number(process.env.DB_PORT) as number,
          user : process.env.DB_NAME,
          password :process.env.DB_PASSWORD 
      },
  },

  staging: {
    client : process.env.DB_CLIENT,
    connection: {
          host : process.env.DB_HOST , 
          database: process.env.DATABASE, 
          port : Number(process.env.DB_PORT) as number,
          user : process.env.DB_NAME,
          password :process.env.DB_PASSWORD 
      },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "demo_credit"
    }
  },

  production: {
    client : process.env.DB_CLIENT,
    connection: {
          host : process.env.DB_HOST , 
          database: process.env.DATABASE, 
          port : Number(process.env.DB_PORT) as number,
          user : process.env.DB_NAME,
          password :process.env.DB_PASSWORD 
      },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "demo_credit"
    }
  }

};

module.exports = config;
