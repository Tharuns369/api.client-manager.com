import BaseException from "./baseException";
class UnprocessableContentException extends BaseException {
    constructor(message, errData) {
        super(message, 422, errData, true);
    }
}
export default UnprocessableContentException;
