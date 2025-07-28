/**
 * Local TypeScript types for the server
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
  provider?: string;
  provider_id?: string;
  avatar_url?: string;
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

export interface DocumentQueryOptions {
  limit: number;
  offset: number;
  authorId?: string;
  isPublic?: boolean;
  tags?: string[];
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
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

export interface SectionQueryOptions {
  limit: number;
  offset: number;
  documentId?: string;
  authorId?: string;
  parentId?: string;
  wikiOnly?: boolean;
  wikiVisibility?: boolean;
  status?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
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
