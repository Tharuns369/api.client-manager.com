import { db } from ".";
export const insertRecord = async (table, data) => {
    return await db.insert(table).values(data).returning();
};
