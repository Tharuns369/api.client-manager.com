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

export const insertRecord = async <R extends DbRecord>(table: DbTable, record: NewDbRecord) => {

    const respData = await db.insert(table).values(record).returning();

    return respData[0] as R;

};


export const updateRecordByColumnValue = async <R extends DbRecord>(
    table: DbTable,
    column: string,
    value: string | number,
    updateData: Partial<R> 
) => {
    const columnInfo = sql.raw(`${getTableName(table)}.${column}`);
    const respData = await db.update(table)
        .set(updateData)
        .where(eq(columnInfo, value))
        .returning();

    return respData[0] as R;
};