import * as dotenv from "dotenv";
dotenv.config();

interface IJWT {
  secret: string;
  issuer: string;
  expires: number;
  subject: string;
  algorithm: string;
}



interface IConfig {
    serverPort: string;
    redis: {
        port: number
        host: string
        password: string
    },
    database: {
        host: string,
        databaseName: string,
        port: number,
        user: string,
        password: string,
        client: string
    },
    saltFactor: number
    JWT: IJWT
    registrationTimeToExpire: number
    verificationLink: string
    paymentProcessors: {
        fluttwave: {
            publicKey: string
            secretKey: string
            webHookHash: string
            callbackURL: string
            paymentURL: string
            transactionsURL: string
            transferURL : string 
        },
        paystack: {
            secretKey: string
            pblicKey: string
            transactionURL: string
            callbackURL: string
            verificationURL: string
        }
    }

}

const Config: IConfig = {
    serverPort: process.env.PORT as string,
    redis: {
        host: process.env.REDIS_HOST as string,
        port: Number(process.env.REDIS_PORT) as number,
        password: process.env.REDIS_PASSWORD as string
    },
    database: {
        host: process.env.DB_HOST as string ,
        databaseName: process.env.DATABASE as string , 
        port: Number(process.env.DB_PORT) as number, 
        user: process.env.DB_NAME as string ,
        password: process.env.DB_PASSWORD as string ,
        client : process.env.DB_CLIENT as string 
    },
    saltFactor: Number(process.env.SALT_FACTOR),
    JWT: {
        secret: process.env.JWT_SECRET as string,
        issuer: process.env.JWT_ISSUER as string,
        subject: process.env.JWT_SUBJECT as string,
        algorithm: process.env.JWT_ALGORITHM as string,
        expires: Number(process.env.JWT_EXPIRES)
    },
    registrationTimeToExpire: Number(process.env.SIGNUP_LINK_EXPIRATION),
    verificationLink: process.env.VERIFICATION_URL as string,
     paymentProcessors: {
         fluttwave: {
            publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY as string , 
            secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string ,
            webHookHash:  process.env.FLW_WEBHOOK_HASH as string,
            callbackURL:  process.env.FLUTTERWAVE_CALLBACK_URL as string,
            paymentURL:  process.env.FLUTTERWAVE_PAYMENT_URL as string,
            transactionsURL: process.env.FLUTTERWAVE_TRANSACTIONS_URL as string,
            transferURL :process.env.FLUTTERWAVE_TRANSFER_URL as string, 
        },
         paystack: {
            secretKey:  process.env.PAYSTACK_SECRET_KEY as string,
            pblicKey:process.env.PAYSTACK_PUBLIC_KEY as string , 
            transactionURL: process.env.PAYSTACK_TRANSACTION_URL as string,
            callbackURL: process.env.PAYSTACK_CALLBACK_URL as string,
            verificationURL: process.env.PAYSTACK_VERIFICATION_URL as string,
        }
    }
}

export default Config;
