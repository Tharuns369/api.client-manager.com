export class ResponseHelper {

    static sendSuccessResponse(c: any, status: number = 200, message: string = "", data: any = []) {
        const responseBody = {
            success: true,
            message,
            status,
            data
        };
        return c.json(responseBody, status);
    }

    static sendErrorResponse(c: any, status: number, message: string = "", data: any = [], errors = {}) {
        const responseBody = {
            success: false,
            message,
            errors,
            status,
            data
        };
        return c.json(responseBody, status);
    }

    static sendValidationErrorResponse(c: any, status: number, message: string, errors: any) {
        const responseBody = {
            success: false,
            status,
            errors,
            message,
            data: null
        };
        return c.json(responseBody, status);
    }

}
