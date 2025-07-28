# Claude Code Agent Instructions

## Immediate Goals

### Step 1: Initialize Project Structure

1. Create the main project directory structure
2. Initialize package.json files for client and server
3. Set up TypeScript configurations
4. Create docker-compose.yml for PostgreSQL and Redis
5. Set up basic .gitignore and README.md

### Step 2: Database Setup

1. Create database migration system using Knex or similar
2. Implement the schema:
   - users table
   - documents table
   - sections table (with JSONB metadata)
   - section_versions table
3. Create seed data for testing

### Step 3: Backend Foundation

1. Set up Express server with TypeScript
2. Implement GraphQL schema for:
   - User authentication (register/login)
   - Document CRUD operations
   - Section management
3. Add Redis connection for caching
4. Create basic authentication middleware

### Step 4: Frontend Foundation

1. Create React app with TypeScript
2. Set up routing (React Router)
3. Implement authentication flow
4. Create basic layout components
5. Set up GraphQL client (Apollo)

### Step 5: Core Features

1. Build markdown editor component
2. Implement custom markup parser for:
   - @wiki-primary, @thread-only tags
   - [!consensus], [!debate] blocks
3. Create Thread View component
4. Create Wiki View component
5. Implement view switching

### Step 6: Interaction Features

1. Add voting system
2. Implement reply threading
3. Create "Promote to Wiki" functionality
4. Add real-time updates with Socket.io

## Code Quality Standards

- Use TypeScript strictly (no 'any' types)
- Write tests for critical functions
- Follow React best practices
- Implement proper error handling
- Add JSDoc comments for complex functions

## Key Files to Create First

1. `/docker-compose.yml` - Development environment
2. `/server/src/index.ts` - Server entry point
3. `/server/src/schema/schema.graphql` - GraphQL schema
4. `/client/src/App.tsx` - React entry point
5. `/shared/types/index.ts` - Shared TypeScript types

## Success Criteria

- User can register and log in
- User can create a new document/idea
- User can write content with custom markup
- System correctly renders Thread and Wiki views
- Users can reply and vote on content
- "Promote to Wiki" feature works

## Important Implementation Details

### Custom Markup Parser

The parser should handle:

```markdown
@wiki-primary - Shows in wiki, collapsed in thread
@thread-only - Never shows in wiki
[!consensus: 85%] content [!end-consensus]
[!debate-active] content [!end-debate]
```

### Dual View Logic

```typescript
// Wiki view: Filter sections where metadata.wiki_visibility = true
// Thread view: Show all sections with proper nesting
```

### Database Metadata Structure

```json
{
  "wiki_visibility": boolean,
  "wiki_position": number,
  "consensus_level": number,
  "promotion_votes": number,
  "status": "draft|active|consensus|contested"
}
```

## Start Coding

Begin with Step 1: Initialize the project structure. Create all necessary directories and configuration files, then move on to database setup.
