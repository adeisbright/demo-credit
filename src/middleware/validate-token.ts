import tedis from "../loader/redis-loader";
import * as jwt from "jsonwebtoken" 
import { NextFunction , Request , Response } from "express";
import NotAuthorizeError from "../common/error-handler/NotAuthorizeError";
import BadRequestError from "../common/error-handler/BadRequestError";
import Config from "../config";


const {
    JWT: { secret, subject, issuer }
} = Config;

const validateToken = async (
    req: Request, 
    res: Response, 
    next : NextFunction
) => {
    try {
        const { authorization } = req.headers;
        let auth = authorization 
       
        if (!auth) {
            return next(new NotAuthorizeError("Provide Authorization Header"));
        }
        let bearer;
        let token = "";
        if (authorization !== undefined) {
            [bearer, token] = authorization.split(" ");
            auth = token
        }

        if (bearer !== "Bearer") {
            res.set("WWW-Authenticate" , "Basic realm= Access Token , charset=UTF-8")
            return next(
                new NotAuthorizeError("Bad Request  :Invalid Authorization")
            );
        }

        const blacklistedTokenKey = `token:blacklist:${token}`
        const isBlacklistedToken = await tedis.get(blacklistedTokenKey) 
      
        if (isBlacklistedToken) {
            return next(new BadRequestError("Please, login again. Session Expired"))
        }
        
        const payload: jwt.JwtPayload = jwt.verify(auth as string, secret, {
            issuer,
            subject
        }) as jwt.JwtPayload;
        
        res.locals.payload = payload
        next();

    } catch (error: any) {
        return next(new NotAuthorizeError(error))
    }
}



export default validateToken
