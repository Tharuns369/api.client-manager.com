import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { clients } from "../schemas/clients";
import { getRecordByColumnValue, getRecordCountsByquery, updateRecordByColumnValue } from "../db/abstractions";
export class ClientsDataServiceProvider {
    async getTotalClientsCount() {
        const clientsCount = await getRecordCountsByquery(clients);
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
    async addClient() {
        return { message: 'Client added successfully' };
    }
    async editClient(id, body) {
        return await updateRecordByColumnValue(clients, 'id', id, body);
    }
    async deleteClient(id) {
        const result = await db
            .delete(clients)
            .where(eq(clients.id, id));
        return result.rowCount;
    }
    async exportClients() {
        return { message: 'Clients exported successfully' };
    }
}
