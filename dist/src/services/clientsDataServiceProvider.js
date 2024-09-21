import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, getTotalRecordsCount, updateRecordById } from "../db/abstractions";
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
    async addClient() {
        return { message: 'Client added successfully' };
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
    async exportClients() {
        return { message: 'Clients exported successfully' };
    }
    async getClientsWiseServices(clientId) {
        const result = await db.query.clients.findMany({
            where: (clients, { eq }) => (eq(clients.id, clientId)),
            columns: {},
            with: {
                services: {
                    columns: {
                        id: true,
                        invoice_amount: true,
                        title: true,
                        type: true,
                        client_id: true
                    }
                }
            }
        });
        return result;
    }
    async getClientsWiseInvoices(clientId) {
        const result = await db.query.clients.findMany({
            where: (clients, { eq }) => (eq(clients.id, clientId)),
            columns: {},
            with: {
                invoices: {
                    columns: {
                        id: true,
                        invoice_amount: true,
                        invoice_date: true,
                        invoice_status: true,
                        payment_date: true,
                        client_id: true
                    }
                }
            }
        });
        return result;
    }
}
