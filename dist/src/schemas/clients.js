import { relations } from 'drizzle-orm';
import { boolean, index, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { services } from './services';
import { invoiceFiles } from './invoicefiles';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
export const clients = pgTable('clients', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    poc: varchar('poc').notNull(),
    role: varchar('role'),
    email: varchar('email').notNull().unique(),
    phone: varchar('phone').notNull(),
    secondaryPhone: varchar('secondary_phone'),
    status: statusEnum('status').default("ACTIVE"),
    remarks: text('remarks'),
    bussinessUrl: text('bussiness_url'),
    address: text('address'),
    state: varchar('state'),
    city: varchar('city'),
    gst: boolean('gst').default(false),
    country: varchar('country'),
    totalInvoiceAmount: numeric('total_invoice_amount', { precision: 100, scale: 2 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
    return {
        nameIdx: index("name_idx").on(table.name),
        statusIdx: index("client_status_idx").on(table.status)
    };
});
export const clientWithServicesRelations = relations(clients, ({ many }) => ({
    services: many(services),
}));
export const clientWithFilesRelations = relations(clients, ({ many }) => ({
    invoiceFiles: many(invoiceFiles),
}));
