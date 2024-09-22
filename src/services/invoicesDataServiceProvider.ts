import { sql } from "drizzle-orm";
import { getRecordByColumnValue, insertRecord, insertRecords, updateRecordById } from "../db/abstractions";
import { db } from "../db/index";
import { Invoice, invoices } from "../schemas/invoices";
import { InvoiceFile, invoiceFiles } from "../schemas/invoicefiles";
import { InvoiceFileValidationInput } from "../validations/invoiceFilesValidations/invoiceFileValidationSchema";


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


  async getInvoices({ skip, limit, filters, sort }: { skip: number; limit: number; filters?: string; sort?: string; }) {
    const query = db.select().from(invoices);
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

  async getInvoiceCount(filters?: string) {
    const query = db.select({ count: sql<number>`COUNT(*)` }).from(invoices);
    if (filters) {
      query.where(sql`${sql.raw(filters)}`);
    }
    const data = await query.execute();
    return data[0].count;
  }



  async viewInvoice(id: string) {
    return { invoice: { id, amount: 1000 } };
  }

  async addInvoiceFile(invoiceFileData: any) {
    return await insertRecord<InvoiceFile>(invoiceFiles, invoiceFileData);
  }

  async getInvoice(id: number) {
    const userData = await getRecordByColumnValue<Invoice>(invoices, 'id', id);

    return userData;
  }

  async insertInvoice(invoiceData: Invoice) {
    const insertedClient = await insertRecords<Invoice[]>(invoices, invoiceData);
    return insertedClient;
  }

  async editInvoice(id: number, body: Invoice) {
    return await updateRecordById(invoices, id, body);
  }


}
