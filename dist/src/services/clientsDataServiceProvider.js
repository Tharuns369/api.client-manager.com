import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, getTotalRecordsCount, insertRecord, updateRecordById } from "../db/abstractions";
import { clients } from "../schemas/clients";
export class ClientsDataServiceProvider {
    async getTotalClientsCount() {
        const clientsCount = await getTotalRecordsCount(clients);
        return clientsCount[0]?.count || 0;
    }
    async getClientsWithPagenation(limit, skip, sortString) {
        const rawQuery = sql `
        SELECT *
        FROM clients
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
        const result = await db.execute(rawQuery);
        return result.rows;
    }
    async getclientsCount() {
        const result = await db.select({ count: sql `COUNT(*)` })
            .from(clients);
        return result[0].count;
    }
    async getClient(id) {
        const clientData = await getRecordByColumnValue(clients, 'id', id);
        return clientData;
    }
    async insertClient(clientData) {
        const insertedClient = await insertRecord(clients, clientData);
        return insertedClient;
    }
    async editClient(id, body) {
        return await updateRecordById(clients, id, body);
    }
    async deleteClient(id) {
        const result = await db
            .delete(clients)
            .where(eq(clients.id, id));
        return result.rowCount;
    }
    async findClientByEmail(email) {
        const userRecord = await getRecordByColumnValue(clients, 'email', email);
        return userRecord;
    }
}
