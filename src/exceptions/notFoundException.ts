import BaseException from "./baseException";


export class NotFoundException extends BaseException {
    constructor(message: string) {
        super(message, 404);
    }
}