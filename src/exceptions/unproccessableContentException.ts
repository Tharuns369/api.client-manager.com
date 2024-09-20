import BaseException from "./baseException";
class UnprocessableContentException extends BaseException {
    constructor(message: string,errData?: any) {
        super(message,422,errData,true);
    }
}
export default UnprocessableContentException







