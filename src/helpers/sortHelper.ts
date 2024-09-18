
export const sortHelper = {
    resultsSort(query: Record<string, string>){
        const { order_by: orderBy = 'created_at', order_type: orderType = 'desc' } = query;

        return `${orderBy} ${orderType}`;
    }
};
