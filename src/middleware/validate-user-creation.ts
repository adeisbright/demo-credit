import { NextFunction, Request, Response } from "express"
import joi from "joi" 
import BadRequestError from "../common/error-handler/BadRequestError"

export const validateUserCreation = async (
    req: Request, 
    _: Response, 
    next : NextFunction
) => {
    try {
        const {
            first_name, 
            last_name, 
            email, 
            password,
            confirm_password
        } = req.body 

        const userSchema = joi.object({
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            email: joi.string()
                .email({
                    minDomainSegments: 2,
                    tlds: {
                        allow: ['com', 'net', 'org', 'info', 'io', 'co', 'ng']
                    }
                }).required(),
            password: joi.string().min(8).required(),
            confirm_password: joi.string().min(8).required(),
        })

        await userSchema.validateAsync({
            first_name, 
            last_name, 
            email, 
            password, 
            confirm_password
        })

        if (password.trim() !== confirm_password.trim()) {
            return next(new BadRequestError("Password does not match"))
        }
        next()
    } catch (error: any) {
        return next(new BadRequestError(error.message))
    }
}