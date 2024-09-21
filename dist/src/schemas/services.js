import { relations } from 'drizzle-orm';
import { index, numeric, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clientServices } from './clientServices';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
export const services = pgTable('services', {
    id: serial('id').primaryKey(),
    type: varchar('type').notNull(),
    status: statusEnum('status').default("ACTIVE"),
    invoice_amount: numeric('invoice_amount', { precision: 100, scale: 2 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
    return {
        typeIdx: index("services_type_idx").on(table.type),
        statusIdx: index("services_status_idx").on(table.status)
    };
});
export const servicesAndClientServicesRelations = relations(services, ({ many }) => ({
    clientServices: many(clientServices),
}));
