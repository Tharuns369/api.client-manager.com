import { asc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getAllRecords, getRecordByColumnValue, insertRecord, updateRecordById } from "../db/abstractions";
import { clients } from "../schemas/clients";
import { invoices } from "../schemas/invoices";
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
    async getAllClients() {
        const allClientServices = await getAllRecords(clients);
        return allClientServices;
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
        const clientsAmountCount = await db.select({ client_name: clients.client_name, totalInvoiceAmount: clients.total_invoice_amount })
            .from(clients);
        return clientsAmountCount;
    }
    async getClientsWiseInvoices(clientId, fromDate, toDate, invoiceStatus) {
        const result = await db.select({
            id: invoices.id,
            client_id: invoices.client_id,
            title: invoices.name,
            type: services.type,
            invoice_amount: invoices.invoice_amount,
            created_at: invoices.created_at,
            updated_at: invoices.updated_at,
            remarks: invoices.remarks
        }).from(invoices).where(eq(invoices.client_id, clientId)).innerJoin(services, eq(invoices.service_id, services.id));
        return result;
    }
    async updateInvoiceAmountByClientIds(data) {
        const clientId = data[0].client_id;
        const totalInvoiceAmount = data.reduce((sum, input) => sum + parseFloat(input.invoice_amount.toString()), 0);
        return await db.update(clients)
            .set({
            total_invoice_amount: sql `${clients.total_invoice_amount} + ${totalInvoiceAmount}::numeric`,
            updated_at: new Date()
        })
            .where(eq(clients.id, clientId));
    }
    async getClientsForDashBoard(filters) {
        const query = db.select({
            id: clients.id,
            client_name: clients.client_name,
            invoice_amount: clients.total_invoice_amount
        }).from(clients);
        if (filters) {
            query.where(sql `${sql.raw(filters)}`);
        }
        // Order by invoice_amount in descending order and limit the result to 5
        query.orderBy(sql `total_invoice_amount DESC`).limit(5);
        // Execute the query and return the data
        const data = await query.execute();
        return data;
    }
    async listDropDown() {
        return await db
            .select({ id: clients.id, client_name: clients.client_name })
            .from(clients)
            .orderBy(clients.client_name);
    }
    async updateTotalInvoiceAmount(clientId, amountDifference) {
        await db.update(clients)
            .set({
            total_invoice_amount: sql `total_invoice_amount + ${amountDifference}`,
        })
            .where(eq(clients.id, clientId));
    }
    async listDropDownForServices(clientId) {
        return await db
            .selectDistinct({
            id: services.id,
            service_name: services.service_name,
        })
            .from(invoices)
            .leftJoin(services, eq(invoices.service_id, services.id))
            .where(eq(invoices.client_id, clientId))
            .orderBy(asc(services.service_name));
    }
    async recurringTypeSummary(filters) {
        // Define your query using Drizzle SQL API
        const query = sql `
      SELECT 
          CAST(COUNT(DISTINCT c.id) AS INTEGER) AS total_recurring_clients,
          CAST(COUNT(DISTINCT sr.id) AS INTEGER) AS total_recurring_services,
          CAST(COALESCE(SUM(i.invoice_amount), 0) AS INTEGER) AS total_recurring_clients_invoice_amount,
          CAST(COALESCE(SUM(DISTINCT sr.invoice_amount), 0) AS INTEGER) AS total_one_time_services_invoices_amount
      FROM 
          ${invoices} as i
      JOIN 
          ${clients} as c ON i.client_id = c.id
      JOIN 
          ${services} as sr ON i.service_id = sr.id
      WHERE sr.type = 'RECURRING'
      ${filters ? sql `AND ${sql.raw(filters)}` : sql ``}
    `;
        const result = await db.execute(query);
        return result.rows;
    }
    async oneTimeTypeSummary(filters) {
        // Define your query using Drizzle SQL API
        const query = sql `
      SELECT 
          CAST(COUNT(DISTINCT c.id) AS INTEGER) AS total_one_time_clients,
          CAST(COUNT(DISTINCT sr.id) AS INTEGER) AS total_one_time_services,
          CAST(COALESCE(SUM(i.invoice_amount), 0) AS INTEGER) AS total_one_time_clients_invoice_amount,
          CAST(COALESCE(SUM(DISTINCT sr.invoice_amount), 0) AS INTEGER) AS total_one_time_services_invoices_amount
      FROM 
          ${invoices} as i
      JOIN 
          ${clients} as c ON i.client_id = c.id
      JOIN 
          ${services} as sr ON i.service_id = sr.id
      WHERE sr.type = 'ONE-TIME'
      ${filters ? sql `AND ${sql.raw(filters)}` : sql ``}

    `;
        const result = await db.execute(query);
        return result.rows;
    }
}
