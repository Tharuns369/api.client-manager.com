import { index, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);
export const userTypeEnum = pgEnum('user_type', ['ADMIN']);

export const users = pgTable('users', {
    firstName: varchar('first_name').notNull(),
    lastName: varchar('last_name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone').notNull(),
    password:varchar('password').notNull().unique(),
    userType: userTypeEnum('user_type').notNull().default("ADMIN"),
    status: statusEnum('status').default("ACTIVE"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

}, (table: any) => {
    return {
        emailIdX: index("email_idx").on(table.email),
        userTypeIdx: index("user_type_idx").on(table.userType)
    };
});


export type user = typeof users.$inferSelect; 
export type newUser = typeof users.$inferInsert; 
