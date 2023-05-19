import { Request, Response, NextFunction } from "express"; 
import ApplicationError from "../../common/error-handler/ApplicationError";
import tedis from "../../loader/redis-loader";
import BadRequestError from "../../common/error-handler/BadRequestError";
import { getUser , addUser } from "../user/user.service";
import Constant from "../../constant";
import Config from "../../config";
import bcrypt from "bcryptjs"
import { v4 } from "uuid"
import NotAuthorizeError from "../../common/error-handler/NotAuthorizeError";
import generateToken from "../../lib/generate-token";

export const temporaryStoreUser = async(
    req: Request, 
    res : Response,
    next:NextFunction
) => {
    try {
        const {  password  , email } = req.body 
        const temporaryUserKey = `prospective:user:${email}`
        
        const [isUser, isTemporaryUser] = await Promise.all([
           getUser({ email }),
            tedis.get(temporaryUserKey)
        ])

        if (!isUser.hasError || isTemporaryUser) {
            return next(new BadRequestError(Constant.messages.userExist))
        }
        
        const salt = await bcrypt.genSalt(Config.saltFactor);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword

        delete req.body.confirm_password
        const reference = v4() 
        
        await tedis.set(reference, JSON.stringify(req.body))
        await tedis.set(temporaryUserKey, "1") 
        await tedis.expire(reference, 60 * Config.registrationTimeToExpire)
        await tedis.expire(temporaryUserKey, 60 * Config.registrationTimeToExpire)
        
        const url = `${Config.verificationLink}?reference=${reference}`
        //Send Email to user's account 

        res.status(200).json({
            statusCode : 200,
            message: Constant.messages.emailVerificationSent, 
            data: {
                verificationURL : url
            }, 
            status : true
        })
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}

export const verifyUserEmail = async (
    req: Request, 
    res : Response,
    next:NextFunction
) => {
    try {
        const reference  = req.query.reference as string 
        
        if (!reference) {
            return next(new BadRequestError(Constant.messages.invalidReference))
        }

        const isReference = await tedis.get(reference) as string 
        if (!isReference) {
            return next(new BadRequestError(Constant.messages.linkExpired))
        }

        const userData = JSON.parse(isReference)
        const temporaryUserKey = `prospective:user:${userData.email}`

        const user = await addUser(userData)

        await tedis.del(temporaryUserKey) 
        await tedis.del(reference as string)
            
        res.status(200).json({
            message: Constant.messages.emailVerified, 
            data: user.data, 
            status: true,
            statusCode : 200
        })

    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}

export const handleLogin = async (
    req: Request, 
    res : Response,
    next:NextFunction
) => {
    try {
        const { email , password } = req.body 
        
        const user  = await getUser({ email })

        if (!user) {
            res.set("WWW-Authenticate","Basic realm=Access to login token , charset=UTF-8")
            return next( new NotAuthorizeError(Constant.messages.invalidLogin))
        }
        if (user.hasError) {
            return next(new BadRequestError(user.message))
        }

        const storedPassword  = user.data.password 
        const isCorrectPassword = await bcrypt.compare(password, storedPassword);
        
        if (!isCorrectPassword) {
            res.set("WWW-Authenticate","Basic realm=Access to login token , charset=UTF-8")
            return next( new NotAuthorizeError(Constant.messages.invalidLogin))
        }

        const {
            first_name,
            last_name,
            id
        } = user.data  
        
        const tokenData: Record<string,any> = {
            id,
            email,
            first_name, 
            last_name,
        }
        const token = generateToken(tokenData) as string
       
        const userDetails: Record<string, any> = {
            id, 
            email, 
            first_name, 
            last_name
        }
        
        res.status(200).json({
            message: Constant.messages.correctLogin, 
            data: {
                token, 
                user: userDetails, 
            } , 
            status : true
        })
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}

export const handleLogout = async (
    _: Request, 
    res: Response,
    next  :NextFunction
) => {
    try {
        const token = res.locals.token
        const { JWT: { expires } } = Config
        
        const blacklistedTokenKey = `token:blacklist:${token}`
        await tedis.set(blacklistedTokenKey, "yes") 
        await tedis.expire(blacklistedTokenKey, expires)
        
        res.status(200).json({
            statusCode: 200,
            success: true, 
            message: "User token blacklisted. Logout completed"
        }) 
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}