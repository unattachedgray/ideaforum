import { IResolvers } from '@graphql-tools/utils';
import { Section, SectionInput } from '@shared/types';
import { Context } from '../utils/context';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { SectionModel } from '../models/SectionModel';
import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const sectionResolvers: IResolvers = {
  Query: {
    section: async (_: any, { id }: { id: string }, { dataLoaders }: Context): Promise<Section | null> => {
      return await dataLoaders.sectionLoader.load(id);
    },
    sections: async (
      _: any,
      { documentId, parentId, limit = 20, offset = 0 }: { documentId: string; parentId?: string; limit: number; offset: number },
      { dataLoaders }: Context
    ): Promise<Section[]> => {
      const sections = await dataLoaders.sectionsByDocumentLoader.load(documentId);
      const filtered = sections.filter(s => (parentId ? s.parentId === parentId : !s.parentId));
      return filtered.slice(offset, offset + limit);
    },
  },
  Mutation: {
    createSection: async (_: any, { input }: { input: SectionInput }, { user }: Context): Promise<Section> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to create a section');
      }
      const newSection = await SectionModel.create({
        ...input,
        authorId: user.id,
      });
      pubsub.publish('SECTION_ADDED', { sectionAdded: newSection });
      return newSection;
    },
    updateSection: async (_: any, { id, input }: { id: string; input: Partial<SectionInput> }, { user, dataLoaders }: Context): Promise<Section> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to update a section');
      }
      const section = await dataLoaders.sectionLoader.load(id);
      if (!section) {
        throw new UserInputError('Section not found');
      }
      if (section.authorId !== user.id) {
        throw new AuthenticationError('You are not authorized to update this section');
      }
      const updatedSection = await SectionModel.update(id, input);
      if (!updatedSection) {
        throw new Error('Failed to update section');
      }
      pubsub.publish('SECTION_UPDATED', { sectionUpdated: updatedSection });
      return updatedSection;
    },
    deleteSection: async (_: any, { id }: { id: string }, { user, dataLoaders }: Context): Promise<boolean> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to delete a section');
      }
      const section = await dataLoaders.sectionLoader.load(id);
      if (!section) {
        throw new UserInputError('Section not found');
      }
      if (section.authorId !== user.id) {
        throw new AuthenticationError('You are not authorized to delete this section');
      }
      await SectionModel.delete(id);
      return true;
    },
    promoteToWiki: async (_: any, { sectionId }: { sectionId: string }, { user }: Context): Promise<Section> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to promote a section');
      }
      // This would involve more complex logic, like checking vote counts
      const updatedSection = await SectionModel.update(sectionId, {
        metadata: { wikiVisibility: true },
      });
      if (!updatedSection) {
        throw new Error('Failed to promote section');
      }
      return updatedSection;
    },
  },
  Subscription: {
    sectionAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('SECTION_ADDED'),
        (payload, variables) => {
          return payload.sectionAdded.documentId === variables.documentId;
        }
      ),
    },
    sectionUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('SECTION_UPDATED'),
        (payload, variables) => {
          return payload.sectionUpdated.documentId === variables.documentId;
        }
      ),
    },
  },
  Section: {
    author: async (parent: Section, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.userLoader.load(parent.authorId);
    },
    document: async (parent: Section, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.documentLoader.load(parent.documentId);
    },
    parent: async (parent: Section, _: any, { dataLoaders }: Context) => {
      if (!parent.parentId) return null;
      return await dataLoaders.sectionLoader.load(parent.parentId);
    },
    children: async (parent: Section, _: any, { dataLoaders }: Context) => {
      const allSections = await dataLoaders.sectionsByDocumentLoader.load(parent.documentId);
      return allSections.filter(s => s.parentId === parent.id);
    },
    versions: async (parent: Section, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.versionsBySectionLoader.load(parent.id);
    },
    votes: async (parent: Section, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.votesBySectionLoader.load(parent.id);
    },
  },
};
