export class ResponseHelper {
    static sendSuccessResponse(c, status = 200, message = "", data = []) {
        const responseBody = {
            success: true,
            message,
            status,
            data
        };
        return c.json(responseBody, status);
    }
    static sendErrorResponse(c, status, message = "", data = [], errors = {}) {
        const responseBody = {
            success: false,
            message,
            errors,
            status,
            data
        };
        return c.json(responseBody, status);
    }
    static sendValidationErrorResponse(c, status, message, errors) {
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
