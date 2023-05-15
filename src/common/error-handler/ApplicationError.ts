
import Constant from "../../constant";
import BaseError from "./BaserError";

class ApplicationError extends BaseError {
    name: string;
    statusCode: number;
    message: string;
    constructor(error: any) {
        super(error);
        Object.setPrototypeOf(this, ApplicationError.prototype);
        this.name = Constant.errorName.serverError;
        this.statusCode = Constant.statusCode.INTERNAL_SERVER_ERROR;
        this.message =  error.message;
    }
}

export default ApplicationError;
