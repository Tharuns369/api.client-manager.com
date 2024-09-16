import { relations } from 'drizzle-orm';
import { index, integer, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { invoices } from './invoices';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);


export const services = pgTable('services', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    type: varchar('type').notNull(),
    clientId: integer('client_id').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    invoiceAmount: numeric('invoice_amount', { precision: 100, scale: 2 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

}, (table: any) => {
    return {
        typeIdx: index("type_idx").on(table.type),
        titleIdx: index("title_idx").on(table.title),
        clientIdIdx: index("client_id_idx").on(table.clientId),
        statusIdx: index("services_status_idx").on(table.status)
    };
});

export const serviceWithInvoicesRelations = relations(services, ({ many }) => ({
    invoices: many(invoices),
})); 

export const serviceWithClietnRelations = relations(services, ({ one }) => ({
    client: one(clients, {
        fields: [services.clientId],
        references: [clients.id],
    })
}
));   


export type service = typeof services.$inferSelect; 
export type newService = typeof services.$inferInsert; 

