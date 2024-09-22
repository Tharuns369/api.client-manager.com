import { db } from ".";
import { DbRecord, DbTable, NewDbRecord } from "../utils/types";
import { eq, getTableName, sql } from "drizzle-orm";

export const getRecordByColumnValue = async <R extends DbRecord>(
    table: DbTable,
    column: string,
    value: string | number
) => {
    const columnInfo = sql.raw(`${getTableName(table)}.${column}`);
    const respData = await db.select().from(table).where(eq(columnInfo, value));
    return respData[0] as R;
};

export const insertRecord = async <R extends DbRecord>(
    table: DbTable,
    record: NewDbRecord
) => {
    const respData = await db.insert(table).values(record).returning();
    return respData[0] as R;
};

export const updateRecordById = async (
    table: DbTable,
    id: number,
    updateData: NewDbRecord
) => {
    const respData = await db.update(table)
        .set(updateData)
        .where(eq(table.id, id))
        .returning();
    return respData[0];
};

export const getAllRecords = async <R extends DbRecord>(table: DbTable) => {
    const respData = await db.select().from(table).execute();
    return respData as R[];
};

export const deleteRecordById = async (table: DbTable,id: number
) => {
    const respData = await db.delete(table)
        .where(eq(table.id, id))
        .returning();
    return respData[0];
};
