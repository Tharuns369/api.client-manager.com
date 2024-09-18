import { sql } from "drizzle-orm";
import { db } from "../db";
import { services } from "../schemas/services";
export class ServicesService {
    async getTotalServices() {
        return { status: "Suuccess", totalServices: 5 };
    }
    async getServices(limit, skip, sortString) {
        const rawQuery = sql `
        SELECT *
        FROM services
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
        const result = await db.execute(rawQuery);
        return result.rows;
    }
    async getSrvicesCount() {
        const result = await db.select({ count: sql `COUNT(*)` })
            .from(services);
        return result[0].count;
    }
    async addService() {
        return { status: "Suuccess", message: 'Service added successfully' };
    }
    async updateService(id) {
        return { status: "Suuccess", message: `Service ${id} updated successfully` };
    }
    async deleteService(id) {
        return { status: "Suuccess", message: `Service ${id} deleted successfully` };
    }
}
