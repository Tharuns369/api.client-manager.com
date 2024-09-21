export class FilterHelper {
    clients(query) {
        let filter = [];
        const { from_date: fromDate, to_date: toDate, status: status, search_string: searchString, } = query;
        if (fromDate && toDate) {
            filter.push(`created_at BETWEEN '${fromDate}' AND '${toDate}'`);
        }
        if (searchString) {
            filter.push(`name ILIKE '%${searchString}%' OR email ILIKE '%${searchString}%'`);
        }
        if (!status) {
            filter.push(`status = 'ACTIVE'`);
        }
        else {
            filter.push(`status = ${status}`);
        }
        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;
    }
}
