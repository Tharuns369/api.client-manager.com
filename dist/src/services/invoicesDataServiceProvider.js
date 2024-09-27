import { sql, eq } from "drizzle-orm";
import { getRecordByColumnValue, insertRecords, updateRecordById } from "../db/abstractions";
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
        const query = sql `
    SELECT 
        i.id,
        i.invoice_amount,
        i.invoice_status,
        i.created_at,
        i.invoice_date,
        sr.id as service_id,
        sr.service_name,
        sr.type,
        c.id as client_id,
        c.client_name,
        c.company_name,
        i.remarks,
        if.key
    FROM ${invoices} AS i
    JOIN ${clients} AS c ON i.client_id = c.id
    JOIN ${services} AS sr ON i.service_id = sr.id
    LEFT JOIN ${invoiceFiles} AS if ON i.id = if.invoice_id
    ${filters ? sql `WHERE ${sql.raw(filters)}` : sql ``}
    ${sort ? sql `ORDER BY ${sql.raw(sort)}` : sql ``}
    LIMIT ${limit}
    OFFSET ${skip}
    `;
        const data = await db.execute(query);
        return data.rows;
    }
    async getInvoicesCount(filters) {
        const query = sql `
    SELECT 
        COUNT(*) AS total_count
    FROM ${invoices} AS i
    JOIN ${clients} AS c ON i.client_id = c.id
    JOIN ${services} AS sr ON i.service_id = sr.id
    ${filters ? sql `WHERE ${sql.raw(filters)}` : sql ``}
    `;
        const data = await db.execute(query);
        return data.rows[0]?.total_count || 0;
    }
    async viewInvoice(id) {
        return { invoice: { id, amount: 1000 } };
    }
    async addInvoiceFile(invoiceFileData) {
        return await insertRecords(invoiceFiles, invoiceFileData);
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
    async getInvoiceByIdWithPopulate(id) {
        const data = await db.select({
            id: invoices.id,
            name: invoices.name,
            client_id: invoices.client_id,
            service_id: invoices.service_id,
            client_name: clients.client_name,
            company_name: clients.company_name,
            service_name: services.type,
            invoice_amount: invoices.invoice_amount,
            invoice_status: invoices.invoice_status,
            invoice_date: invoices.invoice_date,
            payment_date: invoices.payment_date,
            created_at: invoices.created_at,
            remarks: invoices.remarks,
            key: invoiceFiles.key
        })
            .from(invoices)
            .innerJoin(clients, eq(invoices.client_id, clients.id))
            .innerJoin(services, eq(invoices.service_id, services.id))
            .leftJoin(invoiceFiles, eq(invoices.id, invoiceFiles.invoice_id))
            .where(eq(invoices.id, id))
            .execute();
        return data.length ? data[0] : null;
    }
    async getInvoiceFiles(id) {
        const res = await db.select().from(invoiceFiles).where(eq(invoiceFiles.invoice_id, id));
        return res;
    }
    async getFiveLatestInvoices(filters) {
        let query = sql `
      SELECT 
          i.id,
          i.invoice_amount,
          i.invoice_status,
          i.created_at,
          i.invoice_date,
          sr.id as service_id,
          sr.service_name,
          sr.type,
          c.id as client_id,
          c.client_name,
          c.company_name,
          if.key
      FROM invoices as i
      JOIN clients as c 
          ON i.client_id = c.id
      JOIN services as sr 
          ON i.service_id = sr.id  -- Fixed join condition
      LEFT JOIN invoice_files AS if ON i.id = if.invoice_id

      ${filters ? sql `WHERE ${sql.raw(filters)}` : sql ``}
      ORDER BY i.created_at DESC
      LIMIT 5
      `;
        const data = await db.execute(query);
        return data.rows;
    }
    async getAllInvoicesByClientId(clientId, filters) {
        const query = sql `
    SELECT 
        i.id,
        sr.type,
        c.id AS client_id,
        i.invoice_date,
        i.invoice_status,
        i.invoice_amount,
        sr.id AS service_id,
        sr.service_name,
        i.created_at,
        if.key

        
    FROM ${invoices} AS i
    JOIN ${clients} AS c ON i.client_id = c.id
    JOIN ${services} AS sr ON i.service_id = sr.id
    LEFT JOIN ${invoiceFiles} AS if ON i.id = if.invoice_id
    WHERE i.client_id = ${clientId}
    ${filters ? sql `AND ${sql.raw(filters)}` : sql ``}

    `;
        const data = await db.execute(query);
        return data.rows;
    }
    async getInvoiceAmountSum(filters) {
        let query = sql `
      SELECT 
        SUM(i.invoice_amount) AS total_amount
      FROM invoices as i
      
      ${filters ? sql `WHERE ${sql.raw(filters)}` : sql ``}
    
      `;
        const data = await db.execute(query);
        return data.rows;
    }
}
