export class UnauthorizedException extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'UnauthorizedException';
    }
  }
  
  export class ForbiddenException extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ForbiddenException';
    }
  }
  