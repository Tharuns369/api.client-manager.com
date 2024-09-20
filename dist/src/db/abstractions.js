import { db } from ".";
import { count, eq, getTableName, sql } from "drizzle-orm";
export const getRecordByColumnValue = async (table, column, value) => {
    const columnInfo = sql.raw(`${getTableName(table)}.${column}`);
    const respData = await db.select().from(table).where(eq(columnInfo, value));
    return respData[0];
};
export const insertRecord = async (table, record) => {
    const respData = await db.insert(table).values(record).returning();
    3;
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
export const getRecordCountsByquery = async (table) => {
    const respData = await db.select({ count: count() }).from(table);
    ;
    return respData;
};
