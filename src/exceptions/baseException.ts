import { StatusCode } from "hono/utils/http-status";


class BaseException extends Error {
    message: string
    status?: StatusCode
    errData?: any
    isOperational?: boolean
    constructor(message: string, status: StatusCode, errData?: any,isOperational?: boolean) {
        super(message);

        this.message = message
        this.errData = errData
        this.status = status
        this.isOperational = isOperational
    }
}

export default BaseException