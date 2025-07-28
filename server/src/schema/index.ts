import { gql } from 'apollo-server-express';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the GraphQL schema file
const schema = readFileSync(resolve(__dirname, 'schema.graphql'), 'utf-8');

export const typeDefs = gql`${schema}`;
