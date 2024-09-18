import { count, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { clients } from "../schemas/clients";

export class ClientsService {

    async getTotalClients() {
    const clientsCount = await db.select({count: count()}).from(clients);
 
    return clientsCount[0]?.count || 0
  }
  
    async getClientsWithPagenation(limit: number, skip: number, sortString:string) {
        const rawQuery = sql`
        SELECT *
        FROM clients
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
    const result = await db.execute(rawQuery);
    return result.rows; 
}

   async getclientsCount(){
    const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(clients);
    return result[0].count;
   }
  
    async getClient(id: number) {
        return await db.select().from(clients)
        .where(eq(clients.id, id));
    }
  
    async addClient() {
      return { message: 'Client added successfully' };
    }
  
    async updateClient(id: string) {
      return { message: `Client ${id} updated successfully` };
    }
  
    async deleteClient(id:number) {
        const result = await db
        .delete(clients)
        .where(eq(clients.id, id));
       return result.rowCount;

    }
  
    async exportClients() {
      return { message: 'Clients exported successfully' };
    }
  }
  