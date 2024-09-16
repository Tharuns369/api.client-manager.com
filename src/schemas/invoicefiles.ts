import { relations } from 'drizzle-orm';
import { index, integer, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clients } from './clients';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const invoiceFiles = pgTable('invoice_files', {
    id: serial('id').primaryKey(),
    clientId: integer('client_id').notNull(),
    fileName: varchar('file_name').notNull(),
    key: varchar('key').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    size: integer('size').notNull(),
    invoiceAmount: numeric('invoice_amount', { precision: 100, scale: 2 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

}, (table: any) => {
    return {
        keyIdx: index("key_idx").on(table.key),
        clientIdIdx: index("invoice_files_client_id_idx").on(table.clientId)
    };
});

export const invoiceFilesWithClientRealtions = relations(invoiceFiles, ({ one }) => ({
    client: one(clients, {
        fields: [invoiceFiles.clientId],
        references: [clients.id],
    }),
}));


export type invoiceFile = typeof invoiceFiles.$inferSelect; // return type when queried
export type newInvoiceFile = typeof invoiceFiles.$inferInsert; // insert type

