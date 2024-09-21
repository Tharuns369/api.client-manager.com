import { eq, sql } from "drizzle-orm";
import { db } from "../db";
<<<<<<< HEAD
import { getRecordByColumnValue, getTotalRecordsCount, updateRecordById } from "../db/abstractions";
import { clientServices } from "../schemas/clientServices";
=======
import { getRecordByColumnValue, getTotalRecordsCount, insertRecord, updateRecordById } from "../db/abstractions";
import { services } from "../schemas/services";
>>>>>>> features/add-service
export class ClientsServicesDataServiceProvider {
    async getTotalServicesCount() {
        const clientsCount = await getTotalRecordsCount(clientServices);
        return clientsCount[0]?.count || 0;
    }
    async getServices(limit, skip, sortString) {
        const rawQuery = sql `
        SELECT *
        FROM clientServices
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
        const result = await db.execute(rawQuery);
        return result.rows;
    }
    async getSrvicesCount() {
        const result = await db.select({ count: sql `COUNT(*)` })
            .from(clientServices);
        return result[0].count;
    }
    async insertClient(serviceData) {
        const insertedClient = await insertRecord(services, serviceData);
        return insertedClient;
    }
    async deleteService(id) {
        const result = await db
            .delete(clientServices)
            .where(eq(clientServices.id, id));
        return result.rowCount;
    }
    async getService(id) {
        const serviceData = await getRecordByColumnValue(clientServices, 'id', id);
        return serviceData;
    }
    async editService(id, body) {
        return await updateRecordById(clientServices, id, body);
    }
}
