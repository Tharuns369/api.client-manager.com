import { db } from ".";
import { DbRecord, DbTable, NewDbRecord } from "../utils/types";

import { count, eq, getTableName, sql } from "drizzle-orm";


export const getRecordByColumnValue = async <R extends DbRecord>(
    table: DbTable,
    column: string,
    value: string | number
) => {
    const columnInfo = sql.raw(`${getTableName(table)}.${column}`);
    const respData = await db.select().from(table).where(eq(columnInfo, value));
    return respData[0] as R;
};

export const insertRecord = async <R extends DbRecord>(table: DbTable, record: NewDbRecord) => {
    const respData = await db.insert(table).values(record).returning(); 3;
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

export const insertRecords = async <R extends DbRecord[]>(table: DbTable, record: NewDbRecord) => {
    const respData = await db.insert(table).values(record).returning(); 3;
    return respData as R;

};


