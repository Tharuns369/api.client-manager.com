import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { services } from "../schemas/services";
import { getRecordByColumnValue, updateRecordById } from "../db/abstractions";
export class ServiceDataServiceProvider {
    async getServices({ skip, limit, filters, sort }) {
        const query = db.select().from(services);
        if (filters) {
            query.where(sql `${sql.raw(filters)}`);
        }
        if (sort) {
            query.orderBy(sql `${sql.raw(sort)}`);
        }
        query.limit(limit).offset(skip);
        const data = await query.execute();
        return data;
    }
    async getServicesCount(filters) {
        const result = await db.select({ count: sql `COUNT(*)` })
            .from(services);
        return result[0].count;
    }
    async deleteService(id) {
        const result = await db
            .delete(services)
            .where(eq(services.id, id));
        return result.rowCount;
    }
    async getServiceById(id) {
        const serviceData = await getRecordByColumnValue(services, 'id', id);
        return serviceData;
    }
    async editService(id, body) {
        return await updateRecordById(services, id, body);
    }
}
