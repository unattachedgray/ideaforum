import { merge } from 'lodash';
import { userResolvers } from './userResolvers';
import { documentResolvers } from './documentResolvers';
import { sectionResolvers } from './sectionResolvers';
import { voteResolvers } from './voteResolvers';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';

const customScalarResolver = {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSONObject,
};

export const resolvers = merge(
  customScalarResolver,
  userResolvers,
  documentResolvers,
  sectionResolvers,
  voteResolvers
);
