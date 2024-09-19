
import { VALIDATION_MESSAGES } from "../constants/messaegConstants";
import BaseException from "./baseException";

export class ResourceAlreadyExistsException extends BaseException {

    constructor(key: string, message: string) {
        super(message, 409);
        const err = new BaseException(message, 409, true);
        err.status = 409;
        err.message = VALIDATION_MESSAGES.VALIDATION_FAILED;

        let errObject: any = {};

        if (key && message) {
            errObject[key] = message;
        }

        err.errData = errObject;

        return err;
    }
}