import { getDb } from '../utils/database';
import { User, UserInput } from '../types';

const TABLE_NAME = 'users';

export const UserModel = {
  async findByEmail(email: string): Promise<User | null> {
    const user = await getDb()<User>(TABLE_NAME).where({ email }).first();
    return user || null;
  },

  async findById(id: string): Promise<User | null> {
    const user = await getDb()<User>(TABLE_NAME).where({ id }).first();
    return user || null;
  },

  async getByIds(ids: string[]): Promise<User[]> {
    return await getDb()<User>(TABLE_NAME).whereIn('id', ids);
  },

  async getAll(limit: number, offset: number): Promise<User[]> {
    return await getDb()<User>(TABLE_NAME).limit(limit).offset(offset);
  },

  async create(input: Partial<User>): Promise<User> {
    const [user] = await getDb()<User>(TABLE_NAME).insert(input).returning('*');
    return user;
  },

  async update(id: string, input: Partial<UserInput>): Promise<User | null> {
    const [user] = await getDb()<User>(TABLE_NAME).where({ id }).update(input).returning('*');
    return user || null;
  },

  async delete(id: string): Promise<void> {
    await getDb()<User>(TABLE_NAME).where({ id }).del();
  },
};
