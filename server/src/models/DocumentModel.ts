import { getDb } from '../utils/database';
import { Document, DocumentInput, DocumentQueryOptions } from '../types';

const TABLE_NAME = 'documents';

export const DocumentModel = {
  async findById(id: string): Promise<Document | null> {
    const dbDoc = await getDb()(TABLE_NAME).where({ id }).first();
    if (!dbDoc) return null;
    
    // Map database fields to camelCase
    return {
      ...dbDoc,
      authorId: dbDoc.author_id,
      isPublic: dbDoc.is_public,
      viewCount: dbDoc.view_count,
      lastActivityAt: dbDoc.last_activity_at,
      createdAt: dbDoc.created_at,
      updatedAt: dbDoc.updated_at
    };
  },

  async getByIds(ids: string[]): Promise<Document[]> {
    const dbDocs = await getDb()(TABLE_NAME).whereIn('id', ids);
    return dbDocs.map((dbDoc: any) => ({
      ...dbDoc,
      authorId: dbDoc.author_id,
      isPublic: dbDoc.is_public,
      viewCount: dbDoc.view_count,
      lastActivityAt: dbDoc.last_activity_at,
      createdAt: dbDoc.created_at,
      updatedAt: dbDoc.updated_at
    }));
  },

  async getByAuthorIds(authorIds: string[]): Promise<Document[]> {
    const dbDocs = await getDb()(TABLE_NAME).whereIn('author_id', authorIds);
    return dbDocs.map((dbDoc: any) => ({
      ...dbDoc,
      authorId: dbDoc.author_id,
      isPublic: dbDoc.is_public,
      viewCount: dbDoc.view_count,
      lastActivityAt: dbDoc.last_activity_at,
      createdAt: dbDoc.created_at,
      updatedAt: dbDoc.updated_at
    }));
  },

  async getAll(options: DocumentQueryOptions): Promise<Document[]> {
    const query = getDb()(TABLE_NAME);
    if (options.authorId) query.where('author_id', options.authorId);
    if (options.isPublic !== undefined) query.where('is_public', options.isPublic);
    if (options.tags && options.tags.length > 0) query.whereRaw('tags @> ?', [JSON.stringify(options.tags)]);
    if (options.search) query.where('title', 'ilike', `%${options.search}%`);
    if (options.limit) query.limit(options.limit);
    if (options.offset) query.offset(options.offset);
    if (options.orderBy) query.orderBy(options.orderBy, options.orderDirection || 'asc');
    const dbDocs = await query;
    // Map database fields to camelCase
    return dbDocs.map((dbDoc: any) => ({
      ...dbDoc,
      authorId: dbDoc.author_id,
      isPublic: dbDoc.is_public,
      viewCount: dbDoc.view_count,
      lastActivityAt: dbDoc.last_activity_at,
      createdAt: dbDoc.created_at,
      updatedAt: dbDoc.updated_at
    }));
  },

  async search(searchText: string, options: DocumentQueryOptions): Promise<Document[]> {
    return await getDb()<Document>(TABLE_NAME)
      .where('title', 'ilike', `%${searchText}%`)
      .orWhere('description', 'ilike', `%${searchText}%`)
      .limit(options.limit || 10)
      .offset(options.offset || 0);
  },

  async create(input: DocumentInput & { authorId: string }): Promise<Document> {
    const dbInput = {
      title: input.title,
      description: input.description,
      author_id: input.authorId,
      is_public: input.isPublic,
      tags: input.tags
    };
    const [dbDoc] = await getDb()(TABLE_NAME).insert(dbInput).returning('*');
    // Map database fields to camelCase
    return {
      ...dbDoc,
      authorId: dbDoc.author_id,
      isPublic: dbDoc.is_public,
      viewCount: dbDoc.view_count,
      lastActivityAt: dbDoc.last_activity_at,
      createdAt: dbDoc.created_at,
      updatedAt: dbDoc.updated_at
    };
  },

  async update(id: string, input: Partial<DocumentInput>): Promise<Document | null> {
    const [doc] = await getDb()<Document>(TABLE_NAME).where({ id }).update(input).returning('*');
    return doc || null;
  },

  async delete(id: string): Promise<void> {
    await getDb()<Document>(TABLE_NAME).where({ id }).del();
  },
};
