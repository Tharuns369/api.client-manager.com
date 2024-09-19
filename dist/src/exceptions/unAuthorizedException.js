import BaseException from "./baseException";
export class UnauthorisedException extends BaseException {
    constructor(message) {
        super(message, 401);
    }
}
