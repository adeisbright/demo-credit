import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const validateWithdrawal = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    try {
        const { 
            amount , 
            accountNumber,
            bankCode
        } = req.body;
        
        const Schema = Joi.object({
            amount: Joi.number().min(5).required(),
            accountNumber: Joi.string().required(),
            bankCode: Joi.string().required()
        });

        await Schema.validateAsync({
            bankCode , 
            accountNumber,
            amount
        })
       
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateWithdrawal;