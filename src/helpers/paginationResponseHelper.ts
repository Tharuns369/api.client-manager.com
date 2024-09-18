import { number } from "valibot";

export const paginationHelper = {
    getTotalNumberOfPages(count: number, limit: number){
        return Math.ceil(count / limit);
    },

    getHasMore(page: number, limit: number, count: number) {
        return page * limit < count;
    },

    getPaginationResponse({
        page = 1,
        count,
        limit = 10,
        data = [],
        message = ''
    }: {
        page?: number;
        count: number;
        limit?: number;
        data?: any[];
        message?: string;
    }) {
        const hasMore = this.getHasMore(page, limit, count);
        const totalPages = this.getTotalNumberOfPages(count, limit);

        return {
            has_more: hasMore,
            total: Number(count),
            page,
            limit,
            total_pages: totalPages,
            success: true,
            message,
            data
        };
    }
};
