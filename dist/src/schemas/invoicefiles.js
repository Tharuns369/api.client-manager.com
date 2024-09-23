import { relations } from 'drizzle-orm';
import { index, integer, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { invoices } from './invoices';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
export const invoiceFiles = pgTable('invoice_files', {
    id: serial('id').primaryKey(),
    client_id: integer('client_id').notNull(),
    invoice_id: integer('invoice_id').notNull(),
    file_name: varchar('file_name').notNull(),
    key: varchar('key').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    size: integer('size').notNull(),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }).default('0'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
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
export const invoiceFilesWithInvoicesRealtions = relations(invoiceFiles, ({ one }) => ({
    invoice: one(invoices, {
        fields: [invoiceFiles.invoice_id],
        references: [invoices.id],
    }),
}));
