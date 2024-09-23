
import { eq, inArray, name, SQL, sql } from "drizzle-orm";
import { db } from "../db";
import { Service, services } from "../schemas/services";
import { getRecordByColumnValue, insertRecord, updateRecordById } from "../db/abstractions";
export class ServiceDataServiceProvider {

    async insertService(serviceData: Service) {
        const insertedService = await insertRecord<Service>(services, serviceData);
        return insertedService;
    }


    async getServices({ skip, limit, filters, sort }: { skip: number; limit: number; filters?: string; sort?: string; }) {
        const query = db.select().from(services);
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


    async getServicesCount(filters?: string) {
        const result = await db.select({ count: sql<number>`COUNT(*)` })
            .from(services);
        return result[0].count;

    }

    async deleteService(id: number) {
        const result = await db
            .delete(services)
            .where(eq(services.id, id));
        return result.rowCount;

    }

    async getServiceById(id: number) {
        const serviceData = await getRecordByColumnValue<Service>(services, 'id', id);

        return serviceData;
    }

    async editService(id: number, body: Service) {
        return await updateRecordById(services, id, body);
    }

    async updateInvoiceAmountByServiceIds(data: any) {

        const invoiceAmountChunks: SQL[] = [];
        const ids: number[] = [];

        invoiceAmountChunks.push(sql`(case`);
        for (const input of data) {
            invoiceAmountChunks.push(sql`when id = ${input.service_id} then  ${services.invoice_amount} +  ${input.invoice_amount}::numeric`);
            ids.push(input.service_id);
        }
        invoiceAmountChunks.push(sql`end)`);

        const finalInvoiceAmountSql: SQL = sql.join(invoiceAmountChunks, sql.raw(' '));

        return await db.update(services)
            .set({
                invoice_amount: finalInvoiceAmountSql,
                updated_at: new Date()
            })
            .where(inArray(services.id, ids));
    }


    async getServiceForDashBoard(filters?: string) {
        const query = db.select(
            {
                id: services.id,
                type: services.type,
                invoice_amount: services.invoice_amount
            }
        ).from(services);

        // Apply filters if present
        if (filters) {
            query.where(sql`${sql.raw(filters)}`);
        }

        // Order by invoice_amount in descending order and limit the result to 5
        query.orderBy(sql`invoice_amount DESC`).limit(5);

        // Execute the query and return the data
        const data = await query.execute();
        return data;
    }
    async listDropDown(){
        return await db.select({ id: services.id,name: services.type}).from(services);
    }

}