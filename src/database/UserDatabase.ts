import { UserDB } from '../models/User';
import { BaseDataBase } from './BaseDatabase';

export class UserDatabase extends BaseDataBase {
	public static TABLE_USERS = 'users';

	public async findUserById(id: string): Promise<UserDB | undefined> {
		const [userDB]: UserDB[] = await BaseDataBase.connection(
			UserDatabase.TABLE_USERS
		).where({ id });
		return userDB;
	}

	public async findUserByEmail(email: string): Promise<UserDB | undefined> {
		const [userDB]: UserDB[] = await BaseDataBase.connection(
			UserDatabase.TABLE_USERS
		).where({ email });
		return userDB;
	}

	public async insertUser(newUserDB: UserDB): Promise<void> {
		await BaseDataBase.connection(UserDatabase.TABLE_USERS).insert(
			newUserDB
		);
	}
}
