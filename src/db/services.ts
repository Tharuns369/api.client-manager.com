import { db } from ".";
import { clientTable, newClient } from "../schemas/clients";

export const insertRecord = async (table: clientTable, data: newClient) => {

    return await db.insert(table).values(data).returning();
};