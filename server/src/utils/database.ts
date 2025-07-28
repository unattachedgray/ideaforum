import knex, { Knex } from 'knex';
import knexConfig from '../../knexfile';
import { logger } from './logger';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

let db: Knex;

export function getDb(): Knex {
  if (!db) {
    db = knex(config);
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  try {
    db = knex(config);
    await db.raw('SELECT 1+1 AS result');
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.destroy();
    logger.info('Database connection has been closed.');
  }
}
