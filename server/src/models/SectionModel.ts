import { getDb } from '../utils/database';
import { Section, SectionInput, SectionQueryOptions } from '@shared/types';

const TABLE_NAME = 'sections';

export const SectionModel = {
  async findById(id: string): Promise<Section | null> {
    const section = await getDb()<Section>(TABLE_NAME).where({ id }).first();
    return section || null;
  },

  async getByIds(ids: string[]): Promise<Section[]> {
    return await getDb()<Section>(TABLE_NAME).whereIn('id', ids);
  },

  async getByAuthorIds(authorIds: string[]): Promise<Section[]> {
    return await getDb()<Section>(TABLE_NAME).whereIn('author_id', authorIds);
  },

  async getByDocumentIds(documentIds: string[]): Promise<Section[]> {
    return await getDb()<Section>(TABLE_NAME).whereIn('document_id', documentIds);
  },

  async getAll(options: SectionQueryOptions): Promise<Section[]> {
    const query = getDb()<Section>(TABLE_NAME);
    if (options.documentId) query.where({ document_id: options.documentId });
    if (options.authorId) query.where({ author_id: options.authorId });
    if (options.parentId) query.where({ parent_id: options.parentId });
    if (options.wikiVisibility !== undefined) query.whereRaw(`metadata->>'wikiVisibility' = ?`, [options.wikiVisibility]);
    if (options.status) query.whereRaw(`metadata->>'status' = ?`, [options.status]);
    if (options.limit) query.limit(options.limit);
    if (options.offset) query.offset(options.offset);
    if (options.orderBy) query.orderBy(options.orderBy, options.orderDirection || 'asc');
    return await query;
  },

  async create(input: SectionInput & { authorId: string }): Promise<Section> {
    const [section] = await getDb()<Section>(TABLE_NAME).insert(input).returning('*');
    return section;
  },

  async update(id: string, input: Partial<SectionInput>): Promise<Section | null> {
    const [section] = await getDb()<Section>(TABLE_NAME).where({ id }).update(input).returning('*');
    return section || null;
  },

  async updateVoteScore(id: string, value: number): Promise<void> {
    await getDb()<Section>(TABLE_NAME).where({ id }).increment('vote_score', value);
  },

  async delete(id: string): Promise<void> {
    await getDb()<Section>(TABLE_NAME).where({ id }).del();
  },
};
