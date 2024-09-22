import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { getRecordByColumnValue, updateRecordById } from "../db/abstractions";
import { ClientService, clientServices } from "../schemas/clientServices";
import { insertRecord } from "../db/abstractions";
import { Service, services } from "../schemas/services";
import { invoices } from "../schemas/invoices";

export class ClientsServicesDataServiceProvider {
 

}
