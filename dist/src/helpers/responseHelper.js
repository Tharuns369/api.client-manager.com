export class ResponseHelper {
    static sendSuccessResponse(c, status, message = "", data = []) {
        let responseBody = {
            success: true,
            message,
            status: status,
            data
        };
        c.status(status);
        return c.json(responseBody);
    }
    static sendErrorResponse(c, status, message = "", data = [], errors = {}) {
        let responseBody = {
            success: false,
            message,
            errors,
            status: status,
            data
        };
        c.status(status);
        return c.json(responseBody);
    }
    static sendValidationErrorResponse(c, status, message, errors) {
        let responseBody = {
            success: false,
            status,
            errors,
            message,
            data: null
        };
        c.status(status);
        return c.json(responseBody);
    }
    static sendPaginationResponse(c, status = 200, message = '', data = [], total, page, limit, total_pages, has_more, search_string) {
        const responseBody = {
            success: true,
            status,
            message,
            total: Number(total),
            page,
            limit,
            total_pages,
            has_more,
            data,
            search_string,
        };
        return c.json(responseBody);
    }
}
