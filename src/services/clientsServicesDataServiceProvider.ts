import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, updateRecordById } from "../db/abstractions";
import { ClientService, clientServices } from "../schemas/clientServices";

export class ClientsServicesDataServiceProvider {
 

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
  

  // async insertClient(serviceData:Service) {
  //   const insertedClient = await insertRecord<Service>(services,serviceData );
  //   return insertedClient;
  // }


 
}
