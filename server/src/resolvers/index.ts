import { merge } from 'lodash';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { userResolvers } from './userResolvers';
import { documentResolvers } from './documentResolvers';
import { sectionResolvers } from './sectionResolvers';
import { voteResolvers } from './voteResolvers';
import { logicResolvers } from './logicResolvers';

const customScalarResolver = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    serialize(value: any) {
      return value instanceof Date ? value.toISOString() : value;
    },
    parseValue(value: any) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON custom scalar type',
    serialize(value: any) {
      return value;
    },
    parseValue(value: any) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        try {
          return JSON.parse(ast.value);
        } catch {
          return null;
        }
      }
      return null;
    },
  }),
};

export const resolvers = merge(
  customScalarResolver,
  userResolvers,
  documentResolvers,
  sectionResolvers,
  voteResolvers,
  logicResolvers
);
