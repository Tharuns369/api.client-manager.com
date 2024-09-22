import { and, between, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, insertRecord, updateRecordById } from "../db/abstractions";
import { clients } from "../schemas/clients";
import { clientServices } from "../schemas/clientServices";
import { services } from "../schemas/services";
export class ClientsDataServiceProvider {
    async getClientsWithPagenation({ skip, limit, filters, sort }) {
        const query = db.select().from(clients);
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
    async getclientsCount(filters) {
        const query = db.select({ count: sql `COUNT(*)` }).from(clients);
        if (filters) {
            query.where(sql `${sql.raw(filters)}`);
        }
        const data = await query.execute();
        return data[0].count;
    }
    async getClientById(id) {
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
    async allClientsInvoiceAmountCount() {
        const clientsAmountCount = await db.select({ name: clients.name, totalInvoiceAmount: clients.total_invoice_amount })
            .from(clients);
        return clientsAmountCount;
    }
    async getClientsWiseServices(clientId) {
        const result = await db.select({
            id: clientServices.id,
            client_id: clientServices.client_id,
            title: clientServices.title,
            type: services.type,
            invoice_amount: clientServices.invoice_amount,
            created_at: clientServices.created_at,
            updated_at: clientServices.updated_at
        }).from(clientServices).where(eq(clientServices.client_id, clientId)).innerJoin(services, eq(clientServices.service_id, services.id));
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
    async updateInvoiceAmountByClientIds(data) {
        const clientId = data[0].client_id; // Assuming all client IDs are the same
        const totalInvoiceAmount = data.reduce((sum, input) => sum + parseFloat(input.invoice_amount.toString()), 0);
        return await db.update(clients)
            .set({
            total_invoice_amount: sql `${clients.total_invoice_amount} + ${totalInvoiceAmount}::numeric`,
            updated_at: new Date()
        })
            .where(eq(clients.id, clientId));
    }
}
