import { getRecordByColumnValue, insertRecord,updateRecordByColumnValue } from "../db/abstractions";
import { NewUser, User, users } from "../schemas/users";


export class UsersDataServiceProvider {

  async findUserByEmail(email: string) {

    const userRecord = await getRecordByColumnValue<User>(users, 'email', email);

    return userRecord;
  }

  async insertUser(user: NewUser) {

    const insertedUser = await insertRecord<User>(users, user);

    return insertedUser;
  }

  async findUserById(id: number) {

    const userRecord = await getRecordByColumnValue<User>(users, 'id', id);

    return userRecord;
  }

  async getUser(id: number) {
    const userData = await getRecordByColumnValue<User>(users, 'id', id);

   return userData;
  }

  async editUser(id: number, updatedUserData: User) {
    return await updateRecordByColumnValue<User>(users, 'id', id, updatedUserData);
     
  }

}