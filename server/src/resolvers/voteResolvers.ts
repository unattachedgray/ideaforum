import { IResolvers } from '@graphql-tools/utils';
import { Vote, VoteInput } from '@shared';
import { Context } from '../utils/context';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { VoteModel } from '../models/VoteModel';
import { SectionModel } from '../models/SectionModel';
import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const voteResolvers: IResolvers = {
  Mutation: {
    castVote: async (_: any, { input }: { input: VoteInput }, { user, dataLoaders }: Context): Promise<Vote> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to vote');
      }

      const { sectionId, type } = input;

      // Check if section exists
      const section = await dataLoaders.sectionLoader.load(sectionId);
      if (!section) {
        throw new UserInputError('Section not found');
      }

      // Check for existing vote
      const existingVote = await VoteModel.findByUserAndSection(user.id, sectionId, type);
      if (existingVote) {
        // If same vote type, remove it (toggle off)
        await VoteModel.delete(existingVote.id);
        // Update vote score
        await SectionModel.updateVoteScore(sectionId, -existingVote.value);
        // This part is tricky, we should return the deleted vote or null
        // For simplicity, we'll just return a "cancelled" vote object
        return { ...existingVote, value: 0 };
      }

      // Determine vote value
      let value = 0;
      if (type === 'up') value = 1;
      else if (type === 'down') value = -1;
      else if (type === 'promote') value = 2;

      // Create new vote
      const newVote = await VoteModel.create({
        userId: user.id,
        sectionId,
        type,
        value,
      });

      // Update vote score
      await SectionModel.updateVoteScore(sectionId, value);

      pubsub.publish('VOTE_CASTED', { voteCasted: newVote });
      return newVote;
    },
  },
  Subscription: {
    voteCasted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('VOTE_CASTED'),
        (payload, variables) => {
          return payload.voteCasted.documentId === variables.documentId;
        }
      ),
    },
  },
  Vote: {
    user: async (parent: Vote, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.userLoader.load(parent.userId);
    },
    section: async (parent: Vote, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.sectionLoader.load(parent.sectionId);
    },
  },
};
