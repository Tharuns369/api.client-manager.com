import { index, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
export const userTypeEnum = pgEnum('user_type', ['ADMIN']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    first_name: varchar('first_name').notNull(),
    last_name: varchar('last_name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone').notNull(),
    password: varchar('password').notNull().unique(),
    user_type: userTypeEnum('user_type').default("ADMIN"),
    status: statusEnum('status').default("ACTIVE"),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table: any) => {
    return {
        emailIdX: index("email_idx").on(table.email),
        userTypeIdx: index("user_type_idx").on(table.user_type)
    };
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserTable = typeof users;