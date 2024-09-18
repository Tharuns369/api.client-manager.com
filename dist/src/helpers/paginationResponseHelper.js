export const paginationHelper = {
    getTotalNumberOfPages(count, limit) {
        return Math.ceil(count / limit);
    },
    getHasMore(page, limit, count) {
        return page * limit < count;
    },
    getPaginationResponse({ page = 1, count, limit = 10, data = [], message = '' }) {
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
