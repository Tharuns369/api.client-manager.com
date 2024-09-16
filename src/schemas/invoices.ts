import { relations } from 'drizzle-orm';
import { date, index, integer, numeric, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { services } from './services';
export const invoiceStatusEnum = pgEnum('invoice_status', ['PENDING', 'COMPLETED']);


export const invoices = pgTable('invoices', {
    id: serial('id').primaryKey(),
    serviceId: integer('service_id').notNull(),
    invoiceStatus: invoiceStatusEnum('invoice_status').default("PENDING"),
    remarks: text('remarks'),
    invoiceDate: date('invoice_date').notNull(),
    paymentDate: date('payment_date'),
    invoiceAmount: numeric('invoice_amount', { precision: 100, scale: 2 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

}, (table: any) => {
    return {
        serviceIdIdx: index("service_id_idx").on(table.serviceId),
        invoiceStatusIdx: index("invoice_status_idx").on(table.invoiceStatus)
    };
});

export const invoicesWithServiceRealtions = relations(invoices, ({ one }) => ({
    service: one(services, {
        fields: [invoices.serviceId],
        references: [services.id],
    }),
}));


export type invoice = typeof invoices.$inferSelect; 
export type newInvoice = typeof invoices.$inferInsert; 

