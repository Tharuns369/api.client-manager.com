import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, getTotalRecordsCount, insertRecord, updateRecordById } from "../db/abstractions";
import { Service, services } from "../schemas/services";

export class ClientsServicesDataServiceProvider {
  async getTotalServicesCount() {
    const clientsCount = await getTotalRecordsCount(services);
    return clientsCount[0]?.count || 0;

  }

  async getServices(limit: number, skip: number, sortString: string) {

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

  async getSrvicesCount() {
    const result = await db.select({ count: sql<number>`COUNT(*)` })
      .from(services);
    return result[0].count;

  }

  async insertClient(serviceData:Service) {
    const insertedClient = await insertRecord<Service>(services,serviceData );
    return insertedClient;
  }


  async deleteService(id: number) {
    const result = await db
      .delete(services)
      .where(eq(services.id, id));
    return result.rowCount;

  }

  async getService(id: number) {
    const serviceData = await getRecordByColumnValue<Service>(services, 'id', id);

    return serviceData;
  }

  async editService(id: number, body: Service) {
    return await updateRecordById(services, id, body);
  }
}
