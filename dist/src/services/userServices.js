import { eq } from "drizzle-orm";
import { users } from "../schemas/users";
import { db } from "../db/index";
export class UserServices {
    async findUser(email) {
        const user = await db.select().from(users).where(eq(users.email, email));
        return user.length > 0 ? user[0] : null;
    }
    async insertUser(user) {
        return await db.insert(users).values(user).returning();
    }
}
