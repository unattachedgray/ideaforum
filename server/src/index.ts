import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './utils/context';
import { initializeDatabase } from './utils/database';
import { initializeRedis } from './utils/redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer(): Promise<void> {
  try {
    // Initialize database connection
    await initializeDatabase();
    logger.info('Database connected successfully');

    // Initialize Redis connection
    await initializeRedis();
    logger.info('Redis connected successfully');

    // Create Express app
    const app = express();

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: NODE_ENV === 'production' ? true : false,
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
      message: 'Too many requests from this IP, please try again later.',
    });
    app.use('/graphql', limiter);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
      });
    });

    // Create Apollo Server
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: createContext,
      introspection: NODE_ENV !== 'production',
      debug: NODE_ENV !== 'production',
      formatError: (error) => {
        logger.error('GraphQL Error:', error);
        
        // Don't expose internal errors in production
        if (NODE_ENV === 'production' && !error.message.startsWith('User')) {
          return new Error('Internal server error');
        }
        
        return error;
      },
    });

    // Start Apollo Server
    await apolloServer.start();

    // Apply Apollo GraphQL middleware
    apolloServer.applyMiddleware({ 
      app: app as any, 
      path: '/graphql',
      cors: false, // We handle CORS above
    });

    // Create HTTP server
    const httpServer = createServer(app);

    // Create executable schema for subscriptions
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    // Create WebSocket server for GraphQL subscriptions
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    // Setup GraphQL WebSocket server
    const serverCleanup = useServer({
      schema,
      context: async (ctx) => {
        // Extract auth token from connection params
        const token = ctx.connectionParams?.Authorization || ctx.connectionParams?.authorization;
        return createContext({ req: { headers: { authorization: token } } } as any);
      },
    }, wsServer);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start the server
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${PORT}`);
      logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
      logger.info(`🔌 GraphQL WebSocket subscriptions ready at ws://localhost:${PORT}/graphql`);
      logger.info(`🌍 Environment: ${NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      serverCleanup.dispose();
      httpServer.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      serverCleanup.dispose();
      httpServer.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
