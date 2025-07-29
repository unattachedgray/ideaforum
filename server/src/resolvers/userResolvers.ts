import { IResolvers } from '@graphql-tools/utils';
import { User, UserInput } from '../types';
import { Context } from '../utils/context';
import { generateToken } from '../utils/jwt';
import { AuthenticationError } from 'apollo-server-express';
import { UserModel } from '../models/UserModel';
import { OAuth2Client } from 'google-auth-library';
import { getRedisClient } from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const userResolvers: IResolvers = {
  Query: {
    me: async (_: any, __: any, { user, dataLoaders }: Context): Promise<User | null> => {
      if (!user) {
        return null;
      }
      return await dataLoaders.userLoader.load(user.id);
    },
    user: async (_: any, { id }: { id: string }, { dataLoaders }: Context): Promise<User | null> => {
      return await dataLoaders.userLoader.load(id);
    },
    users: async (_: any, { limit = 10, offset = 0 }: { limit: number, offset: number }): Promise<User[]> => {
      return await UserModel.getAll(limit, offset);
    },
  },
  Mutation: {
    requestLoginLink: async (_: any, { email }: { email: string }): Promise<boolean> => {
      let user = await UserModel.findByEmail(email);
      if (!user) {
        // Create a new user if they don't exist
        user = await UserModel.create({ email, username: email.split('@')[0] });
      }
      
      const token = uuidv4();
      const redis = getRedisClient();
      await redis.set(`login:${token}`, user.id, { EX: 60 * 15 }); // 15-minute expiry

      // In a real app, you would email this link to the user
      console.log(`Login link for ${email}: http://localhost:3000/login/token/${token}`);
      
      return true;
    },
    loginWithToken: async (_: any, { token }: { token: string }): Promise<{ token: string; user: User }> => {
      const redis = getRedisClient();
      const userId = await redis.get(`login:${token}`);
      
      if (!userId) {
        throw new AuthenticationError('Invalid or expired login token');
      }
      
      await redis.del(`login:${token}`);
      
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      
      const sessionToken = generateToken({ id: user.id, email: user.email });
      return { token: sessionToken, user };
    },
    loginWithGoogle: async (_: any, { input }: { input: { token: string } }): Promise<{ token: string; user: User }> => {
      if (!GOOGLE_CLIENT_ID) {
        throw new AuthenticationError('Google OAuth not configured');
      }
      
      const ticket = await client.verifyIdToken({
        idToken: input.token,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new AuthenticationError('Invalid Google token');
      }

      let user = await UserModel.findByEmail(payload.email);
      if (!user) {
        user = await UserModel.create({
          email: payload.email,
          username: payload.name || payload.email.split('@')[0],
          provider: 'google',
          provider_id: payload.sub,
          avatar_url: payload.picture,
        });
      }

      const sessionToken = generateToken({ id: user.id, email: user.email });
      return { token: sessionToken, user };
    },
    updateUser: async (_: any, { input }: { input: Partial<UserInput> }, { user }: Context): Promise<User> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to update your profile');
      }
      const updatedUser = await UserModel.update(user.id, input);
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }
      return updatedUser;
    },
    deleteUser: async (_: any, __: any, { user }: Context): Promise<boolean> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to delete your account');
      }
      await UserModel.delete(user.id);
      return true;
    },
  },
  User: {
    documents: async (parent: User, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.documentsByAuthorLoader.load(parent.id);
    },
    sections: async (parent: User, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.sectionsByAuthorLoader.load(parent.id);
    },
    votes: async (parent: User, _: any, { dataLoaders }: Context) => {
      return await dataLoaders.votesByUserLoader.load(parent.id);
    },
  },
};
