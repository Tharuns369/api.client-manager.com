import BaseException from "./baseException";


export class BadRequestException extends BaseException {
    constructor(message: string) {
        super(message, 400);
    }
}