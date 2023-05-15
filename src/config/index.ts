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
        port : number 
        host: string
        password  :string 
    },
    database: {
        host: string , 
        database: string, 
        port: number , 
        user:string,
        password: string, 
        client : string 
    },
    saltFactor: number
    JWT: IJWT 
    registrationTimeToExpire: number
    verificationLink: string 
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
        database: process.env.DATABASE as string , 
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
    verificationLink: process.env.APP_FRONTEND_URL as string,
}

export default Config;
