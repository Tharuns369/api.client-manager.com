import { and, between, eq, sql } from "drizzle-orm";
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
    async getClientsWiseInvoices(clientId, fromDate, toDate, invoiceStatus) {
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
                    },
                    where: (invoices) => and(fromDate && toDate ? between(invoices.invoice_date, fromDate, toDate) : undefined, invoiceStatus ? eq(invoices.invoice_status, invoiceStatus) : undefined),
                    orderBy: (invoices, { desc }) => [desc(invoices.invoice_date)]
                }
            }
        });
        return result;
    }
}
