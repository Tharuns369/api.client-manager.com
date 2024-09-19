import { getRecordByColumnValue, insertRecord } from "../db/abstractions";
import { NewUser, User, users } from "../schemas/users";


export class UserDataServiceProvider {

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

}