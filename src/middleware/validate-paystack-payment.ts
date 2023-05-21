import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";
/**
 * @description Validates the data provided by a user and the client service 
 * when a user tries to confirm  payment. 
 * @param {Object} req HTTP request object 
 * @param {Object} res HTTP response object
 * @param {Function} next A callback for the next middleware
 * @returns the request to the next middleware
 */
const validatePaystackCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reference = req.query.reference as string
        const trxref = req.query.trxref as string
        
        if ( reference === undefined || 
            reference.length <= 0 ||
            trxref === undefined || 
            trxref.length <= 0) {
            
            return res.send("payment-unknown")
        }

        const Schema = Joi.object({
            reference: Joi.string().required(),
            trxref: Joi.string().min(10).required()
        });

        await Schema.validateAsync({
            trxref,
            reference
        });

        res.locals.transactionId = reference
        next();
    } catch (error: any) {
        console.log(error)
        return next(new BadRequestError(error.message));
    }
};

export default validatePaystackCallback;