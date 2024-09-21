import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, getTotalRecordsCount, insertRecord, updateRecordById } from "../db/abstractions";
import { Client, clients } from "../schemas/clients";

export class ClientsDataServiceProvider {

  async getTotalClientsCount() {
    const clientsCount = await getTotalRecordsCount(clients);

    return clientsCount[0]?.count || 0;
  }

  async getClientsWithPagenation(limit: number, skip: number, sortString: string) {
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

  async getclientsCount() {
    const result = await db.select({ count: sql<number>`COUNT(*)` })
      .from(clients);
    return result[0].count;
  }
  
  

  async getClient(id: number) {
    const clientData = await getRecordByColumnValue<Client>(clients, 'id', id);

    return clientData;
  }

  async insertClient(clientData:Client) {
    const insertedClient = await insertRecord<Client>(clients,clientData );
    return insertedClient;
  }

  async editClient(id: number, body: Client) {
    return await updateRecordById(clients,id, body);

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
}
