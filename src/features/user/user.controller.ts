import { Request, Response, NextFunction } from "express"; 
import ApplicationError from "../../common/error-handler/ApplicationError";


export const createUser = async(
    _: Request, 
    res: Response, 
    next : NextFunction
) => {
    try {
        res.json({
            status: true,
            statusCode: 200,
            message: "Successful",
            data : {}
        })
    } catch (error: any) {
        return next(new ApplicationError(error))
    }
}