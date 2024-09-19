import BaseException from "./baseException";
export class ForbiddenException extends BaseException {
    constructor(message) {
        super(message, 403);
    }
}
