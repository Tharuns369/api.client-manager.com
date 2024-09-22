import { sql } from "drizzle-orm";
import { db } from "../db";
export class ClientsServicesDataServiceProvider {
    async getServices(limit, skip, sortString) {
        const rawQuery = sql `
        SELECT *
        FROM clientServices
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
        const result = await db.execute(rawQuery);
        return result.rows;
    }
}
