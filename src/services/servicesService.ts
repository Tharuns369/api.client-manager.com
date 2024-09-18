import { sql } from "drizzle-orm";
import { db } from "../db";
import { services } from "../schemas/services";

export class ServicesService {
    async getTotalServices() {
      return {status:"Suuccess", totalServices: 5 };
    }
  
    async getServices(limit: number, skip: number, sortString:string) {

        const rawQuery = sql`
        SELECT *
        FROM services
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
    const result = await db.execute(rawQuery);
    return result.rows; 
}

   async getSrvicesCount(){
    const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(services);
    return result[0].count;

   }

    async addService() {
      return {status:"Suuccess",  message: 'Service added successfully' };
    }
  
    async updateService(id: string) {
      return { status:"Suuccess", message: `Service ${id} updated successfully` };
    }
  
    async deleteService(id: string) {
      return { status:"Suuccess", message: `Service ${id} deleted successfully` };
    }
  }
  