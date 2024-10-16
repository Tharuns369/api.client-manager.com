export class FilterHelper {
    clients(query) {
        let filter = [];
        const { from_date: fromDate, to_date: toDate, status: status, client_id: clientId, search_string: searchString, } = query;
        if (fromDate && toDate) {
            filter.push(`created_at BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`);
        }
        if (searchString) {
            filter.push(`client_name ILIKE '%${searchString}%' OR poc ILIKE '%${searchString}%'`);
        }
        if (!status) {
            filter.push(`status = 'ACTIVE'`);
        }
        else {
            filter.push(`status = ${status}`);
        }
        if (clientId) {
            filter.push(`id = ${clientId}`);
        }
        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;
    }
    services(query) {
        let filter = [];
        const { from_date: fromDate, to_date: toDate, status: status, search_string: searchString, type } = query;
        if (fromDate && toDate) {
            filter.push(`created_at BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`);
        }
        if (type) {
            filter.push(`type = '${type}'`);
        }
        if (searchString) {
            filter.push(`service_name ILIKE '%${searchString}%'`);
        }
        if (!status) {
            filter.push(`status = 'ACTIVE'`);
        }
        else {
            filter.push(`status = '${status}'`);
        }
        let queryString = filter.length > 0 ? filter.join(' AND ') : '';
        return queryString;
    }
    invoices(query) {
        let filter = [];
        const { from_date: fromDate, to_date: toDate, status, client_id: clientId, service_id: serviceId, search_string: searchString, type } = query;
        if (fromDate && toDate) {
            filter.push(`i.invoice_date BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`);
        }
        if (searchString) {
            filter.push(`c.client_name ILIKE '%${searchString}%' `);
        }
        if (clientId) {
            filter.push(`c.id = ${clientId}`);
        }
        if (serviceId) {
            filter.push(`sr.id = ${serviceId}`);
        }
        if (status) {
            filter.push(`i.invoice_status = '${status}'`);
        }
        if (type) {
            filter.push(`sr.type = '${type}'`);
        }
        let queryString = filter.length > 0 ? filter.join(' AND ') : '';
        return queryString;
    }
    invoicesForRecurringServices(query) {
        let filter = [];
        const { from_date: fromDate, to_date: toDate, status: status } = query;
        if (fromDate && toDate) {
            filter.push(`invoice_date BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`);
        }
        filter.push(`type = 'RECURRING'`);
        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;
    }
    invoicesForOneTimeServices(query) {
        let filter = [];
        const { from_date: fromDate, to_date: toDate, } = query;
        if (fromDate && toDate) {
            filter.push(`invoice_date BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`);
        }
        filter.push(`type = 'ONE-TIME'`);
        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;
    }
}
