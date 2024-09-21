export const sortHelper = {
    sort: (query: any) => {
        const sortBy = query.sort_by || 'created_at';
        const sortType = query.sort_type || 'desc';

        return `${sortBy} ${sortType}`;
    }
};
