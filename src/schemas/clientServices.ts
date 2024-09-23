import { relations } from 'drizzle-orm';
import { index, integer, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { invoices } from './invoices';
import { services } from './services';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const clientServices = pgTable('client_services', {
    id: serial('id').primaryKey(),
    title: varchar('title'),
    client_id: integer('client_id').notNull(),
    service_id: integer('service_id').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }).default('0'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table: any) => {
    return {
        titleIdx: index("title_idx").on(table.title),
        clientIdIdx: index("client_id_idx").on(table.client_id),
        statusIdx: index("client_services_status_idx").on(table.status)
    };
});
export const clientServicesAndInvoicesRelations = relations(clientServices, ({ many }) => ({
    invoices: many(invoices),
}));
export const clientServicesAndClientRelations = relations(clientServices, ({ one }) => ({
    client: one(clients, {
        fields: [clientServices.client_id],
        references: [clients.id],
    }),
    service: one(services, {
        fields: [clientServices.service_id],
        references: [services.id],
    })

}
));
export type ClientService = typeof clientServices.$inferSelect;
export type NewClientService = typeof clientServices.$inferInsert;
export type ClientServiceTable = typeof clientServices;