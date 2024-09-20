import { db } from ".";
import { eq, getTableName, sql } from "drizzle-orm";
export const getRecordByColumnValue = async (table, column, value) => {
    const columnInfo = sql.raw(`${getTableName(table)}.${column}`);
    const respData = await db.select().from(table).where(eq(columnInfo, value));
    return respData[0];
};
export const insertRecord = async (table, record) => {
    const respData = await db.insert(table).values(record).returning();
    return respData[0];
};
export const updateRecordByColumnValue = async (table, column, value, updateData) => {
    const columnInfo = sql.raw(`${getTableName(table)}.${column}`);
    const respData = await db.update(table)
        .set(updateData)
        .where(eq(columnInfo, value))
        .returning();
    return respData[0];
};
