import { sql, eq } from "drizzle-orm";
import { getRecordByColumnValue, insertRecord, insertRecords, updateRecordById } from "../db/abstractions";
import { db } from "../db/index";
import { invoices } from "../schemas/invoices";
import { invoiceFiles } from "../schemas/invoicefiles";
import { services } from "../schemas/services";
import { clients } from "../schemas/clients";
export class InvoicesDataServiceProvider {
    async getTotalInvoicesAmount() {
        const result = await db
            .select({
            totalAmount: sql `SUM(invoice_amount)`.as('totalAmount')
        })
            .from(invoices);
        return { totalAmount: result[0]?.totalAmount || 0 };
    }
    async getClientsTotalInvoicesAmount() {
        return { clients: [{ id: 1, totalAmount: 3000 }, { id: 2, totalAmount: 2000 }] };
    }
    async getServicesTotalInvoicesAmount() {
        return { services: [{ id: 1, totalAmount: 1500 }, { id: 2, totalAmount: 3500 }] };
    }
    async getInvoices({ skip, limit, filters, sort }) {
        const query = db.select({
            id: invoices.id,
            name: invoices.name,
            client_id: invoices.client_id,
            service_id: invoices.service_id,
            client_name: clients.name,
            service_name: services.type,
            invoice_amount: invoices.invoice_amount,
            invoice_status: invoices.invoice_status,
            invoice_date: invoices.invoice_date,
            payment_date: invoices.payment_date,
            created_at: invoices.created_at
        }).from(invoices).innerJoin(services, eq(invoices.service_id, services.id)).innerJoin(clients, eq(invoices.client_id, clients.id));
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
    async getInvoiceCount(filters) {
        const query = db.select({ count: sql `COUNT(*)` }).from(invoices);
        if (filters) {
            query.where(sql `${sql.raw(filters)}`);
        }
        const data = await query.execute();
        return data[0].count;
    }
    async viewInvoice(id) {
        return { invoice: { id, amount: 1000 } };
    }
    async addInvoiceFile(invoiceFileData) {
        return await insertRecord(invoiceFiles, invoiceFileData);
    }
    async getInvoiceById(id) {
        const userData = await getRecordByColumnValue(invoices, 'id', id);
        return userData;
    }
    async insertInvoice(invoiceData) {
        const insertedClient = await insertRecords(invoices, invoiceData);
        return insertedClient;
    }
    async editInvoice(id, body) {
        return await updateRecordById(invoices, id, body);
    }
    async getInvoiceFileById(id) {
        const invoiceFileData = await getRecordByColumnValue(invoiceFiles, 'id', id);
        return invoiceFileData;
    }
    async getInvoiceAmountSum(filters) {
        const query = db.select({ totalAmount: sql `SUM(invoice_amount)` }).from(invoices);
        if (filters) {
            query.where(sql `${sql.raw(filters)}`);
        }
        const data = await query.execute();
        return data[0].totalAmount || 0; // Return 0 if no matching records
    }
}
