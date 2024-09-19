import BaseException from "./baseException";

export class ForbiddenException extends BaseException {
    constructor(message: string) {
        super(message, 403);
    }
}