# Idea Forum

A unified discussion-wiki platform where debates evolve into structured knowledge. The core innovation is a single data model with dual presentation layers (Thread View and Wiki View).

## Project Overview

Idea Forum (ἰδέα Forum) allows users to create documents that can be viewed both as threaded discussions and as structured wiki pages. Content can be promoted from discussion threads to wiki format based on consensus and voting.

## Technology Stack

- **Frontend**: React 18 with TypeScript, TailwindCSS, Apollo Client
- **Backend**: Node.js with Express, GraphQL, PostgreSQL, Redis
- **Authentication**: Passwordless login with magic links + Google OAuth
- **Real-time**: GraphQL subscriptions
- **Development**: Docker Compose for local development

## Features

- 🔐 **Passwordless Authentication**: Magic link login + Google OAuth
- 📝 **Custom Markup System**: Special tags for wiki/thread visibility
- 🔄 **Dual View System**: Switch between Thread and Wiki views
- 🗳️ **Voting & Consensus**: Vote on content and promote to wiki
- 💬 **Nested Discussions**: Threaded replies and comments
- 🔍 **Real-time Updates**: Live updates via GraphQL subscriptions

## Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd idea-forum
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development environment**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   cd server
   npm run migrate
   ```

6. **Start the development servers**

   ```bash
   # Terminal 1: Start the backend
   cd server
   npm run dev

   # Terminal 2: Start the frontend
   cd client
   npm start
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000/graphql

## Project Structure

```
idea-forum/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   └── utils/          # Utilities and Apollo setup
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── resolvers/      # GraphQL resolvers
│   │   ├── schema/         # GraphQL schema
│   │   ├── utils/          # Utilities and database
│   │   └── middleware/     # Express middleware
│   └── package.json
├── shared/                 # Shared TypeScript types
│   └── types/
├── database/               # Database migrations and seeds
│   ├── migrations/
│   └── seeds/
├── docker-compose.yml      # Development services
└── README.md
```

## Custom Markup System

The platform supports special markup tags for controlling content visibility:

```markdown
@wiki-primary
This content appears prominently in wiki view and collapsed in thread view.
@end

@thread-only
This content only appears in thread view, never in wiki.
@end

[!consensus: 85%]
This represents content with high consensus level.
[!end-consensus]

[!debate-active]
This content is actively being debated.
[!end-debate]
```

## Development

### Available Scripts

**Root level:**

- `npm install` - Install all dependencies
- `npm run dev` - Start both client and server in development mode

**Server (`cd server`):**

- `npm run dev` - Start server with hot reload
- `npm run build` - Build for production
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

**Client (`cd client`):**

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Database Management

```bash
# Run migrations
cd server && npm run migrate

# Rollback last migration
cd server && npm run migrate:rollback

# Create new migration
cd server && npm run migrate:make migration_name

# Seed database
cd server && npm run seed
```

### Environment Variables

Key environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `REACT_APP_GRAPHQL_URL` - GraphQL endpoint for frontend

## Authentication Flow

1. **Magic Link Login**: User enters email, receives login link
2. **Google OAuth**: One-click login with Google account
3. **JWT Tokens**: Secure session management
4. **Passwordless**: No passwords to remember or manage

## API Documentation

The GraphQL API provides:

### Queries

- `me` - Get current user
- `documents` - List documents with filtering
- `document(id)` - Get specific document with sections
- `sections` - Get sections for a document

### Mutations

- `requestLoginLink(email)` - Request magic link login
- `loginWithToken(token)` - Login with magic link token
- `loginWithGoogle(input)` - Login with Google OAuth
- `createDocument(input)` - Create new document
- `createSection(input)` - Add section to document
- `castVote(input)` - Vote on content
- `promoteToWiki(sectionId)` - Promote content to wiki

### Subscriptions

- `sectionAdded(documentId)` - Real-time section updates
- `voteCasted(documentId)` - Real-time vote updates

## Deployment

### Production Build

```bash
# Build all packages
npm run build

# Build server only
cd server && npm run build

# Build client only
cd client && npm run build
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@ideaforum.com or join our Discord community.
