import { getRecordByColumnValue, insertRecord, updateRecordById } from "../db/abstractions";
import { users } from "../schemas/users";
export class UsersDataServiceProvider {
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
    async getUser(id) {
        const userData = await getRecordByColumnValue(users, 'id', id);
        return userData;
    }
    async editUser(id, updatedUserData) {
        return await updateRecordById(users, id, updatedUserData);
    }
}
