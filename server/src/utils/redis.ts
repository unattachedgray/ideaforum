import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

let redisClient: RedisClientType;

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

export async function initializeRedis(): Promise<void> {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (err) => logger.error('Redis Client Error', err));

  try {
    await redisClient.connect();
    logger.info('Connected to Redis successfully.');
  } catch (error) {
    logger.error('Could not connect to Redis:', error);
    throw error;
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    logger.info('Redis connection has been closed.');
  }
}
