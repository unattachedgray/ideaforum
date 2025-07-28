# Idea Forum - Development Brief

## Project Overview

You are building "Idea Forum" (ἰδέα Forum), a unified discussion-wiki platform where debates evolve into structured knowledge. The core innovation is a single data model with dual presentation layers (Thread View and Wiki View).

## Your Primary Goal

Create a working MVP of Idea Forum with these core features:

1. User authentication
2. Document creation with custom markup
3. Dual view system (Thread/Wiki)
4. Basic interaction features (replies, voting)
5. Content promotion from thread to wiki

## Technology Stack

- Frontend: React 18 with TypeScript, TailwindCSS, MDX
- Backend: Node.js with Express, PostgreSQL, Redis
- API: GraphQL with subscriptions
- Real-time: Socket.io

## Project Structure

```
idea-forum/
├── client/               # React frontend
├── server/              # Node.js backend
├── shared/              # Shared types/utilities
├── database/            # SQL migrations
└── docker-compose.yml   # Development environment
```

## Development Phases

1. **Phase 1**: Set up project structure and database
2. **Phase 2**: Implement authentication and basic CRUD
3. **Phase 3**: Build markup parser and dual views
4. **Phase 4**: Add interaction features
5. **Phase 5**: Polish and prepare for deployment

## Current Task

Start by initializing the project structure and setting up the development environment.
