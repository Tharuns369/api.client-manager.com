import BaseException from "./baseException";



export class UnauthorisedException extends BaseException {
    constructor(message: string) {
        super(message, 401);
    }
}