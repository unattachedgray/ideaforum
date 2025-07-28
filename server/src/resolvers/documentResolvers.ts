import { IResolvers } from '@graphql-tools/utils';
import { Document, DocumentInput } from '@shared/types';
import { Context } from '../utils/context';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { DocumentModel } from '../models/DocumentModel';

export const documentResolvers: IResolvers = {
  Query: {
    document: async (_: any, { id }: { id: string }, { dataLoaders }: Context): Promise<Document | null> => {
      return await dataLoaders.documentLoader.load(id);
    },
    documents: async (
      _: any,
      { limit = 10, offset = 0, authorId, isPublic, tags }: { limit: number; offset: number; authorId?: string; isPublic?: boolean; tags?: string[] }
    ): Promise<Document[]> => {
      return await DocumentModel.getAll({ limit, offset, authorId, isPublic, tags });
    },
    searchDocuments: async (
      _: any,
      { query, limit = 10, offset = 0 }: { query: string; limit: number; offset: number }
    ): Promise<Document[]> => {
      return await DocumentModel.search(query, { limit, offset });
    },
  },
  Mutation: {
    createDocument: async (_: any, { input }: { input: DocumentInput }, { user }: Context): Promise<Document> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to create a document');
      }
      const newDocument = await DocumentModel.create({
        ...input,
        authorId: user.id,
      });
      return newDocument;
    },
    updateDocument: async (_: any, { id, input }: { id: string; input: Partial<DocumentInput> }, { user, dataLoaders }: Context): Promise<Document> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to update a document');
      }
      const document = await dataLoaders.documentLoader.load(id);
      if (!document) {
        throw new UserInputError('Document not found');
      }
      if (document.authorId !== user.id) {
        throw new AuthenticationError('You are not authorized to update this document');
      }
      const updatedDocument = await DocumentModel.update(id, input);
      if (!updatedDocument) {
        throw new Error('Failed to update document');
      }
      return updatedDocument;
    },
    deleteDocument: async (_: any, { id }: { id: string }, { user, dataLoaders }: Context): Promise<boolean> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to delete a document');
      }
      const document = await dataLoaders.documentLoader.load(id);
      if (!document) {
        throw new UserInputError('Document not found');
      }
      if (document.authorId !== user.id) {
        throw new AuthenticationError('You are not authorized to delete this document');
      }
      await DocumentModel.delete(id);
      return true;
    },
  },
  Document: {
    author: async (parent: Document, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.userLoader.load(parent.authorId);
    },
    sections: async (parent: Document, { parentId }: { parentId?: string }, { dataLoaders }: Context) => {
      const sections = await dataLoaders.sectionsByDocumentLoader.load(parent.id);
      if (parentId) {
        return sections.filter(section => section.parentId === parentId);
      }
      return sections.filter(section => !section.parentId); // Return root sections
    },
  },
};
