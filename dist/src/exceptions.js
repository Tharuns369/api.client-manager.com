export class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedException';
    }
}
export class ForbiddenException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ForbiddenException';
    }
}
