class BaseException extends Error {
    message;
    status;
    errData;
    isOperational;
    constructor(message, status, errData, isOperational) {
        super(message);
        this.message = message;
        this.errData = errData;
        this.status = status;
        this.isOperational = isOperational;
    }
}
export default BaseException;
