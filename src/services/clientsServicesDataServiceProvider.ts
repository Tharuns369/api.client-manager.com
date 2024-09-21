import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, getTotalRecordsCount, updateRecordById } from "../db/abstractions";
import { ClientService, clientServices } from "../schemas/clientServices";

export class ClientsServicesDataServiceProvider {
  async getTotalServicesCount() {
    const clientsCount = await getTotalRecordsCount(clientServices);
    return clientsCount[0]?.count || 0;

  }

  async getServices(limit: number, skip: number, sortString: string) {

    const rawQuery = sql`
        SELECT *
        FROM clientServices
        ORDER BY ${sql.raw(sortString)} 
        LIMIT ${limit}
        OFFSET ${skip}
    `;
    const result = await db.execute(rawQuery);
    return result.rows;
  }

  async getSrvicesCount() {
    const result = await db.select({ count: sql<number>`COUNT(*)` })
      .from(clientServices);
    return result[0].count;

  }

  async addService() {
    return { status: "Suuccess", message: 'Service added successfully' };
  }


  async deleteService(id: number) {
    const result = await db
      .delete(clientServices)
      .where(eq(clientServices.id, id));
    return result.rowCount;

  }

  async getService(id: number) {
    const serviceData = await getRecordByColumnValue<ClientService>(clientServices, 'id', id);

    return serviceData;
  }

  async editService(id: number, body: ClientService) {
    return await updateRecordById(clientServices, id, body);
  }
}
