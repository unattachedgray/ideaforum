import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export const authMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.warn('Socket connection attempt without token');
    return next(new Error('Authentication error: Token not provided'));
  }

  try {
    const decoded = verifyToken(token);
    (socket as any).user = decoded;
    next();
  } catch (error) {
    logger.error('Socket authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};
