import { Request, Response } from 'express';
import { User } from '@shared';
import { verifyToken } from './jwt';
import { createDataLoaders, DataLoaders } from './dataloaders';

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
  dataLoaders: DataLoaders;
}

export function createContext({ req, res }: { req: Request; res: Response }): Context {
  let user: User | null = null;
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      user = decoded as User;
    } catch (error) {
      // Invalid token, user remains null
    }
  }

  const dataLoaders = createDataLoaders();

  return {
    req,
    res,
    user,
    dataLoaders,
  };
}
