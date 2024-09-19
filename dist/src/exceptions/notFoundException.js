import BaseException from "./baseException";
export class NotFoundException extends BaseException {
    constructor(message) {
        super(message, 404);
    }
}
