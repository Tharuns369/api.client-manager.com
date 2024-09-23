import { relations } from 'drizzle-orm';
import { boolean, index, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { clientServices } from './clientServices';
import { invoiceFiles } from './invoicefiles';
import { invoices } from './invoices';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
export const clients = pgTable('clients', {
    id: serial('id').primaryKey(),
    client_name: varchar('client_name').notNull(),
    client_phone: varchar('client_phone'),
    client_email: varchar('client_email'),
    company_name: varchar('company_name').notNull(),
    poc: varchar('poc').notNull(),
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
    total_invoice_amount: numeric('total_invoice_amount', { precision: 100, scale: 2 }).default('0'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow()
}, (table) => {
    return {
        clientNameIdx: index("clientname_idx").on(table.client_name),
        statusIdx: index("client_status_idx").on(table.status)
    };
});
export const clientRelations = relations(clients, ({ many }) => ({
    clientServices: many(clientServices),
    invoiceFiles: many(invoiceFiles),
    invoices: many(invoices),
}));
