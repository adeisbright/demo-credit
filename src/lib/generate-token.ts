import * as jwt from "jsonwebtoken"
import fileLogger from "../common/logging/error-logger"
import Config from "../config" 

const { JWT: { secret, subject, issuer, expires } } = Config 

const generateToken = (data: Record<string,any>) => {
    try {
        const {id , email, first_name , last_name } = data
        const token = jwt.sign({
            id,
            email,
            first_name, 
            last_name,
        }, secret, {
            issuer: issuer,
            expiresIn: expires,
            algorithm: "HS512",
            subject: subject
        });
        return token
    } catch (error: any) {
        fileLogger.log({
            message: error.message,
            level : "error"
        })
    }
}

export default generateToken