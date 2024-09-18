import { count, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { services } from "../schemas/services";

export class ServicesService {
    async getTotalServicesCount() {
      const clientsCount = await db.select({count: count()}).from(services);
      return clientsCount[0]?.count || 0 
    
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
  
    async deleteService(id:number) {
      const result = await db
      .delete(services)
      .where(eq(services.id, id));
     return result.rowCount;

  }

    async getService(id: number) {
      return await db.select().from(services)
      .where(eq(services.id, id));
  }
  }
  