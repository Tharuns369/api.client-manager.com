export const sortHelper = {
    resultsSort(query) {
        const { order_by: orderBy = 'created_at', order_type: orderType = 'desc' } = query;
        return `${orderBy} ${orderType}`;
    }
};
