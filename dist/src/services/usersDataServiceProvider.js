import { getRecordByColumnValue, insertRecord } from "../db/abstractions";
import { users } from "../schemas/users";
export class UserDataServiceProvider {
    async findUserByEmail(email) {
        const userRecord = await getRecordByColumnValue(users, 'email', email);
        return userRecord;
    }
    async insertUser(user) {
        const insertedUser = await insertRecord(users, user);
        return insertedUser;
    }
    async findUserById(id) {
        const userRecord = await getRecordByColumnValue(users, 'id', id);
        return userRecord;
    }
}
