import { relations } from 'drizzle-orm';
import { index, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clientServices } from './clientServices';
import { invoices } from './invoices';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
export const serviceTypesEnum = pgEnum('type', ['RECURRING', 'ONE-TIME']);

export const services = pgTable('services', {
    id: serial('id').primaryKey(),
    service_name : varchar('service_name').notNull(),
    type: serviceTypesEnum('type').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }).default('0'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table: any) => {
    return {
        typeIdx: index("services_type_idx").on(table.type),
        serviceNameIdx: index("services_name_idx").on(table.service_name),
        statusIdx: index("services_status_idx").on(table.status)
    };
});
export const servicesAndClientServicesRelations = relations(services, ({ many }) => ({
    clientServices: many(clientServices),
    invoices: many(invoices)
}));



export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type ServiceTable = typeof services;