import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const validateTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { 
            amount , 
            recipient_id,
        } = req.body;
        
        const Schema = Joi.object({
            amount: Joi.number().min(1).required(),
            recipient_id: Joi.number().min(1).required(),
        });

        await Schema.validateAsync({
            recipient_id,
            amount
        })
        const userId = Number(res.locals.payload.id)
        if (userId === recipient_id) {
            return next(new BadRequestError("You cannot transfer money to yourself"))
        }
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateTransfer;