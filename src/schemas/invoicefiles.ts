import { relations } from 'drizzle-orm';
import { index, integer, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clients } from './clients';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const invoiceFiles = pgTable('invoice_files', {
    id: serial('id').primaryKey(),
    client_id: integer('client_id').notNull(),
    file_name: varchar('file_name').notNull(),
    key: varchar('key').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    size: integer('size').notNull(),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),

}, (table: any) => {
    return {
        keyIdx: index("key_idx").on(table.key),
        clientIdIdx: index("invoice_files_client_id_idx").on(table.client_id)
    };
});

export const invoiceFilesWithClientRealtions = relations(invoiceFiles, ({ one }) => ({
    client: one(clients, {
        fields: [invoiceFiles.client_id],
        references: [clients.id],
    }),
}));


export type InvoiceFile = typeof invoiceFiles.$inferSelect; // return type when queried
export type NewInvoiceFile = typeof invoiceFiles.$inferInsert; // insert type

export type InvoiceFileTable = typeof invoiceFiles;

