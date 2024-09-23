import { relations } from 'drizzle-orm';
import { date, index, integer, numeric, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { invoiceFiles } from './invoicefiles';
import { services } from './services';
export const invoiceStatusEnum = pgEnum('invoice_status', ['PENDING', 'COMPLETED']);

export const invoices = pgTable('invoices', {
    id: serial('id').primaryKey(),
    name: text('name'),
    service_id: integer('service_id').notNull(),
    client_id: integer('client_id').notNull(),
    invoice_status: invoiceStatusEnum('invoice_status').default("PENDING"),
    remarks: text('remarks'),
    invoice_date: date('invoice_date').notNull(),
    payment_date: date('payment_date'),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }).default('0'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table: any) => {
    return {
        clientInvoiceIdIdx: index("client_invoice_id_idx").on(table.client_id),
        invoiceStatusIdx: index("invoice_status_idx").on(table.invoice_status)
    };
});

export const invoicesRelations = relations(invoices, ({ many }) => ({
    invoicesFiles: many(invoiceFiles)
}));
export const invoicesWithServiceRealtions = relations(invoices, ({ one }) => ({
    service: one(services, {
        fields: [invoices.service_id],
        references: [services.id],
    }),
}));

export const invoicesWithClietnRealtions = relations(invoices, ({ one }) => ({
    client: one(clients, {
        fields: [invoices.client_id],
        references: [clients.id],
    }),
}));
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceTable = typeof invoices;