import { relations } from 'drizzle-orm';
import { date, index, integer, numeric, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { clientServices } from './clientServices';
import { clients } from './clients';
export const invoiceStatusEnum = pgEnum('invoice_status', ['PENDING', 'COMPLETED']);
export const invoices = pgTable('invoices', {
    id: serial('id').primaryKey(),
    client_service_id: integer('client_service_id').notNull(),
    client_id: integer('client_id').notNull(),
    invoice_status: invoiceStatusEnum('invoice_status').default("PENDING"),
    remarks: text('remarks'),
    invoice_date: date('invoice_date').notNull(),
    payment_date: date('payment_date'),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
    return {
        clientServiceIdIdx: index("client_service_id_idx").on(table.client_service_id),
        invoiceStatusIdx: index("invoice_status_idx").on(table.invoice_status)
    };
});
export const invoicesWithServiceRealtions = relations(invoices, ({ one }) => ({
    service: one(clientServices, {
        fields: [invoices.client_service_id],
        references: [clientServices.id],
    }),
}));
export const invoicesWithClietnRealtions = relations(invoices, ({ one }) => ({
    client: one(clients, {
        fields: [invoices.client_id],
        references: [clients.id],
    }),
}));
