import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import { services } from "../schemas/services";
import { getRecordByColumnValue, insertRecord, updateRecordById } from "../db/abstractions";
export class ServiceDataServiceProvider {
    async insertService(serviceData) {
        const insertedService = await insertRecord(services, serviceData);
        return insertedService;
    }
    async getServices({ skip, limit, filters, sort }) {
        const query = db.select().from(services);
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
    async getServicesCount(filters) {
        const result = await db.select({ count: sql `COUNT(*)` })
            .from(services);
        return result[0].count;
    }
    async deleteService(id) {
        const result = await db
            .delete(services)
            .where(eq(services.id, id));
        return result.rowCount;
    }
    async getServiceById(id) {
        const serviceData = await getRecordByColumnValue(services, 'id', id);
        return serviceData;
    }
    async editService(id, body) {
        return await updateRecordById(services, id, body);
    }
    async updateInvoiceAmountByServiceIds(data) {
        const invoiceAmountChunks = [];
        const ids = [];
        invoiceAmountChunks.push(sql `(case`);
        for (const input of data) {
            invoiceAmountChunks.push(sql `when id = ${input.service_id} then  ${services.invoice_amount} +  ${input.invoice_amount}::numeric`);
            ids.push(input.service_id);
        }
        invoiceAmountChunks.push(sql `end)`);
        const finalInvoiceAmountSql = sql.join(invoiceAmountChunks, sql.raw(' '));
        return await db.update(services)
            .set({
            invoice_amount: finalInvoiceAmountSql,
            updated_at: new Date()
        })
            .where(inArray(services.id, ids));
    }
}
