import { getDb } from '../utils/database';
import { Document, DocumentInput, DocumentQueryOptions } from '../types';

const TABLE_NAME = 'documents';

export const DocumentModel = {
  async findById(id: string): Promise<Document | null> {
    const doc = await getDb()<Document>(TABLE_NAME).where({ id }).first();
    return doc || null;
  },

  async getByIds(ids: string[]): Promise<Document[]> {
    return await getDb()<Document>(TABLE_NAME).whereIn('id', ids);
  },

  async getByAuthorIds(authorIds: string[]): Promise<Document[]> {
    return await getDb()<Document>(TABLE_NAME).whereIn('authorId', authorIds);
  },

  async getAll(options: DocumentQueryOptions): Promise<Document[]> {
    const query = getDb()<Document>(TABLE_NAME);
    if (options.authorId) query.where('authorId', options.authorId);
    if (options.isPublic !== undefined) query.where('isPublic', options.isPublic);
    if (options.tags && options.tags.length > 0) query.whereRaw('tags @> ?', [JSON.stringify(options.tags)]);
    if (options.search) query.where('title', 'ilike', `%${options.search}%`);
    if (options.limit) query.limit(options.limit);
    if (options.offset) query.offset(options.offset);
    if (options.orderBy) query.orderBy(options.orderBy, options.orderDirection || 'asc');
    return await query;
  },

  async search(searchText: string, options: DocumentQueryOptions): Promise<Document[]> {
    return await getDb()<Document>(TABLE_NAME)
      .where('title', 'ilike', `%${searchText}%`)
      .orWhere('description', 'ilike', `%${searchText}%`)
      .limit(options.limit || 10)
      .offset(options.offset || 0);
  },

  async create(input: DocumentInput & { authorId: string }): Promise<Document> {
    const [doc] = await getDb()<Document>(TABLE_NAME).insert(input).returning('*');
    return doc;
  },

  async update(id: string, input: Partial<DocumentInput>): Promise<Document | null> {
    const [doc] = await getDb()<Document>(TABLE_NAME).where({ id }).update(input).returning('*');
    return doc || null;
  },

  async delete(id: string): Promise<void> {
    await getDb()<Document>(TABLE_NAME).where({ id }).del();
  },
};
