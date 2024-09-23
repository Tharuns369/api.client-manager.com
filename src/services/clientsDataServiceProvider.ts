import { and, between, eq, inArray, SQL, sql } from "drizzle-orm";
import { db } from "../db";
import { getAllRecords, getRecordByColumnValue, insertRecord, updateRecordById } from "../db/abstractions";
import { Client, clients } from "../schemas/clients";
import { invoices } from "../schemas/invoices";
import { clientServices } from "../schemas/clientServices";
import { services } from "../schemas/services";




export class ClientsDataServiceProvider {


  async getClientsWithPagenation({ skip, limit, filters, sort }: { skip: number; limit: number; filters?: string; sort?: string; }) {
    const query = db.select().from(clients);
    if (filters) {
      query.where(sql`${sql.raw(filters)}`);
    }
    if (sort) {
      query.orderBy(sql`${sql.raw(sort)}`);
    }
    query.limit(limit).offset(skip);
    const data = await query.execute();
    return data;
  }

  async getAllClients() {
    const allClientServices = await getAllRecords(clients);
    return allClientServices;
  }

  async getclientsCount(filters?: string) {
    const query = db.select({ count: sql<number>`COUNT(*)` }).from(clients);
    if (filters) {
      query.where(sql`${sql.raw(filters)}`);
    }
    const data = await query.execute();
    return data[0].count;
  }


  async getClientById(id: number) {
    const clientData = await getRecordByColumnValue<Client>(clients, 'id', id);

    return clientData;
  }

  async insertClient(clientData: Client) {
    const insertedClient = await insertRecord<Client>(clients, clientData);
    return insertedClient;
  }

  async editClient(id: number, body: Client) {
    return await updateRecordById(clients, id, body);

  }

  async deleteClient(id: number) {
    const result = await db
      .delete(clients)
      .where(eq(clients.id, id));
    return result.rowCount;

  }

  async findClientByEmail(email: string) {

    const userRecord = await getRecordByColumnValue<Client>(clients, 'email', email);

    return userRecord;
  }

  async allClientsInvoiceAmountCount() {

    const clientsAmountCount = await db.select({ client_name: clients.client_name, totalInvoiceAmount: clients.total_invoice_amount })
      .from(clients);
    return clientsAmountCount;
  }


  async getClientsWiseServices(clientId: number) {

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

  async getClientsWiseInvoices(clientId: number, fromDate: string, toDate: string, invoiceStatus?: 'PENDING' | 'COMPLETED') {

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

  async getClintsWiseInvoices(clientId: number, fromDate: string, toDate: string, invoiceStatus?: 'PENDING' | 'COMPLETED') {
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
            client_id: true,

          },
          where: (invoices) =>
            and(
              fromDate && toDate ? between(invoices.invoice_date, fromDate, toDate) : undefined,
              invoiceStatus ? eq(invoices.invoice_status, invoiceStatus) : undefined
            ),
          orderBy: (invoices, { desc }) => [desc(invoices.invoice_date)]

        }

      }
    });

    return result;
  }


  async updateInvoiceAmountByClientIds(data: any[]) {
    const clientId = data[0].client_id; // Assuming all client IDs are the same
    const totalInvoiceAmount = data.reduce((sum: number, input: { invoice_amount: string | number; }) =>
      sum + parseFloat(input.invoice_amount.toString()), 0);

    return await db.update(clients)
      .set({
        total_invoice_amount: sql`${clients.total_invoice_amount} + ${totalInvoiceAmount}::numeric`,
        updated_at: new Date()
      })
      .where(eq(clients.id, clientId));
  }


  async getClientsForDashBoard(filters?: string) {
    const query = db.select(
      {
        id: clients.id,
        client_name: clients.client_name,
        invoice_amount: clients.total_invoice_amount
      }
    ).from(clients);

    if (filters) {
      query.where(sql`${sql.raw(filters)}`);
    }

    // Order by invoice_amount in descending order and limit the result to 5
    query.orderBy(sql`total_invoice_amount DESC`).limit(5);

    // Execute the query and return the data
    const data = await query.execute();
    return data;
  }
}

