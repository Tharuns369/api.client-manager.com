import BaseException from "./baseException";


class UnprocessableContentException extends BaseException {

    constructor(message: string, errData?: any) {
        super(message, 422, errData);
    }
}

export default UnprocessableContentException