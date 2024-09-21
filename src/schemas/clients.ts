import { relations } from 'drizzle-orm';
import { boolean, index, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clientServices } from './clientServices';
import { invoiceFiles } from './invoicefiles';
import { invoices } from './invoices';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);


export const clients = pgTable('clients', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    poc: varchar('poc').notNull(),
    role: varchar('role'),
    email: varchar('email').notNull().unique(),
    phone: varchar('phone').notNull(),
    secondary_phone: varchar('secondary_phone'),
    status: statusEnum('status').default("ACTIVE"),
    remarks: text('remarks'),
    bussiness_url: text('bussiness_url'),
    address: text('address'),
    state: varchar('state'),
    city: varchar('city'),
    gst: boolean('gst').default(false),
    country: varchar('country'),
    total_invoice_amount: numeric('total_invoice_amount', { precision: 100, scale: 2 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow()

}, (table: any) => {
    return {
        nameIdx: index("name_idx").on(table.name),
        statusIdx: index("client_status_idx").on(table.status)
    };
});


export const clientRelations = relations(clients, ({ many }) => ({
    clientServices: many(clientServices),
    invoiceFiles: many(invoiceFiles),
    invoices: many(invoices),
}));


export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type ClientTable = typeof clients;