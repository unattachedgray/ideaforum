import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message,
    },
  });
};
