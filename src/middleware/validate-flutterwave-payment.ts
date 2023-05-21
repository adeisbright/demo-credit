import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError" 


/**
 * @description Validates the data provided by a user and the client service 
 * when a user tries to confirm  payment. 
 * @param {Object} req HTTP request object 
 * @param {Object} res HTTP response object
 * @param {Function} next A callback for the next middleware
 * @returns the request to the next middleware
 */
const validateFlutterwaveCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query || 
            req.query.transaction_id == null || 
            req.query.tx_ref == null
        ){
            return res.send("payment-unknown")
        }

        
        const status = req.query.status as string  
        const txRef = req.query.tx_ref as string  
        const  transactionId = req.query.transaction_id as string

        if (status !== "successful"){
            return res.render("payment-failed", {
                title : "Payment Failed"
            })
        }

        const Schema = Joi.object({
            transactionId: Joi.string().required(),
            txRef: Joi.string().min(5).required()
        });

        await Schema.validateAsync({
            transactionId,
            txRef
        });

        res.locals.transactionId = transactionId
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateFlutterwaveCallback;