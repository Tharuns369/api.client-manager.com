import { relations } from 'drizzle-orm';
import { index, integer, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { invoices } from './invoices';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);


export const services = pgTable('services', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    type: varchar('type').notNull(),
    client_id: integer('client_id').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),

}, (table: any) => {
    return {
        typeIdx: index("type_idx").on(table.type),
        titleIdx: index("title_idx").on(table.title),
        clientIdIdx: index("client_id_idx").on(table.client_id),
        statusIdx: index("services_status_idx").on(table.status)
    };
});

export const serviceWithInvoicesRelations = relations(services, ({ many }) => ({
    invoices: many(invoices),
})); 

export const serviceWithClietnRelations = relations(services, ({ one }) => ({
    client: one(clients, {
        fields: [services.client_id],
        references: [clients.id],
    })
}
));   


export type Service = typeof services.$inferSelect; 
export type NewService = typeof services.$inferInsert; 
export type ServiceTable = typeof services;

