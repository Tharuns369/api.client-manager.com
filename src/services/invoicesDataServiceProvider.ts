import { sql } from "drizzle-orm";
import { getRecordByColumnValue, insertRecord, updateRecordById } from "../db/abstractions";
import { db } from "../db/index";
import { Invoice, invoices } from "../schemas/invoices";


export class InvoicesDataServiceProvider {
 
  async getTotalInvoicesAmount() {
    const result = await db
      .select({
        totalAmount: sql`SUM(invoice_amount)`.as('totalAmount')
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

  async getInvoices(limit: number, skip: number, sortString: string) {

    const rawQuery = sql`
        SELECT *
        FROM invoices
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
    const result = await db.execute(rawQuery);
    return result.rows;
  }

  async getInvoiceCount() {
    const result = await db.select({ count: sql<number>`COUNT(*)` })
      .from(invoices);
    return result[0].count;
  }

  async viewInvoice(id: string) {
    return { invoice: { id, amount: 1000 } };
  }

  async uploadInvoice() {
    return { message: 'Invoice uploaded successfully' };
  }

  async getInvoice(id: number) {
    const userData = await getRecordByColumnValue<Invoice>(invoices, 'id', id);

    return userData;
  }

  async insertInvoice(invoiceData:Invoice ) {
    const insertedClient = await insertRecord<Invoice>(invoices,invoiceData );
    return insertedClient;
  }

  async editInvoice(id: number, body: Invoice) {
    return await updateRecordById(invoices, id, body);
  }


}
