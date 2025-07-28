/**
 * Shared TypeScript types for Idea Forum
 * Used across client, server, and database layers
 */

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User extends BaseEntity {
  username: string;
  email: string;
  provider: string;
  provider_id?: string;
  avatar_url?: string;
  bio?: string;
  isActive: boolean;
}

export interface UserInput {
  username: string;
  email: string;
  bio?: string;
}

export interface GoogleLoginInput {
  token: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

// Document types
export interface Document extends BaseEntity {
  title: string;
  description?: string;
  authorId: string;
  author?: User;
  sections: Section[];
  isPublic: boolean;
  tags: string[];
  viewCount: number;
  lastActivityAt: Date;
}

export interface DocumentInput {
  title: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

// Section types
export interface SectionMetadata {
  wikiVisibility: boolean;
  wikiPosition?: number;
  consensusLevel?: number;
  promotionVotes: number;
  status: 'draft' | 'active' | 'consensus' | 'contested';
  markupTags: string[];
  threadDepth: number;
}

export interface Section extends BaseEntity {
  documentId: string;
  document?: Document;
  content: string;
  authorId: string;
  author?: User;
  parentId?: string;
  parent?: Section;
  children: Section[];
  position: number;
  metadata: SectionMetadata;
  versions: SectionVersion[];
  votes: Vote[];
  voteScore: number;
}

export interface SectionInput {
  documentId: string;
  content: string;
  parentId?: string;
  position?: number;
  metadata?: Partial<SectionMetadata>;
}

export interface SectionVersion extends BaseEntity {
  sectionId: string;
  section?: Section;
  content: string;
  metadata: SectionMetadata;
  version: number;
  changeReason?: string;
}

// Vote types
export type VoteType = 'up' | 'down' | 'promote';

export interface Vote extends BaseEntity {
  userId: string;
  user?: User;
  sectionId: string;
  section?: Section;
  type: VoteType;
  value: number; // 1 for up, -1 for down, 2 for promote
}

export interface VoteInput {
  sectionId: string;
  type: VoteType;
}

// Custom markup types
export interface MarkupBlock {
  type: 'wiki-primary' | 'thread-only' | 'consensus' | 'debate';
  content: string;
  attributes?: Record<string, string | number>;
}

export interface ParsedContent {
  blocks: MarkupBlock[];
  plainText: string;
}

// View types
export type ViewMode = 'thread' | 'wiki';

export interface ViewConfig {
  mode: ViewMode;
  showMetadata: boolean;
  sortBy: 'position' | 'votes' | 'recent';
  filterBy?: {
    status?: SectionMetadata['status'][];
    consensusLevel?: number;
    author?: string;
  };
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

// GraphQL subscription types
export interface SubscriptionPayload<T = any> {
  type: 'created' | 'updated' | 'deleted';
  data: T;
  userId?: string;
  documentId?: string;
}

// Real-time event types
export interface RealtimeEvent {
  type: 'section_created' | 'section_updated' | 'vote_cast' | 'user_joined' | 'user_left';
  payload: any;
  timestamp: Date;
  userId: string;
  documentId?: string;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  validationErrors?: ValidationError[];
}

// Database query types
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  include?: string[];
}

export interface DocumentQueryOptions extends QueryOptions {
  authorId?: string;
  isPublic?: boolean;
  tags?: string[];
  search?: string;
}

export interface SectionQueryOptions extends QueryOptions {
  documentId?: string;
  authorId?: string;
  parentId?: string;
  wikiVisibility?: boolean;
  status?: SectionMetadata['status'];
}

// Utility types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// All types are exported individually above
// Import them directly: import { User, Document, Section } from '@shared/types'
