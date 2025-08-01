import { getDb } from '../utils/database';
import { Vote, VoteInput, VoteType } from '@shared';

const TABLE_NAME = 'votes';

export const VoteModel = {
  async findById(id: string): Promise<Vote | null> {
    const vote = await getDb()<Vote>(TABLE_NAME).where({ id }).first();
    return vote || null;
  },

  async findByUserAndSection(userId: string, sectionId: string, type: VoteType): Promise<Vote | null> {
    const vote = await getDb()<Vote>(TABLE_NAME)
      .where('user_id', userId)
      .where('section_id', sectionId)
      .where('type', type)
      .first();
    return vote || null;
  },

  async getByUserIds(userIds: string[]): Promise<Vote[]> {
    return await getDb()<Vote>(TABLE_NAME).whereIn('user_id', userIds);
  },

  async getBySectionIds(sectionIds: string[]): Promise<Vote[]> {
    return await getDb()<Vote>(TABLE_NAME).whereIn('section_id', sectionIds);
  },

  async create(input: VoteInput & { userId: string; value: number }): Promise<Vote> {
    const dbInput = {
      user_id: input.userId,
      section_id: input.sectionId,
      type: input.type,
      value: input.value
    };
    const [vote] = await getDb()<Vote>(TABLE_NAME).insert(dbInput).returning('*');
    return vote;
  },

  async delete(id: string): Promise<void> {
    await getDb()<Vote>(TABLE_NAME).where({ id }).del();
  },
};
