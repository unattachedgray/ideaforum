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
  type: 'wiki-primary' | 'thread-only' | 'consensus' | 'debate' | 'synthesis';
  content: string;
  attributes?: Record<string, any>;
  startPosition: number;
  endPosition: number;
}

export interface ParsedContent {
  blocks: MarkupBlock[];
  plainText: string;
  metadata?: any;
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

// Phase 2: Logic Analysis Types
export enum FallacyType {
  AD_HOMINEM = 'ad_hominem',
  STRAW_MAN = 'straw_man',
  FALSE_DILEMMA = 'false_dilemma',
  SLIPPERY_SLOPE = 'slippery_slope',
  APPEAL_TO_AUTHORITY = 'appeal_to_authority',
  CIRCULAR_REASONING = 'circular_reasoning',
  HASTY_GENERALIZATION = 'hasty_generalization',
  RED_HERRING = 'red_herring',
  APPEAL_TO_EMOTION = 'appeal_to_emotion',
  BANDWAGON_FALLACY = 'bandwagon_fallacy'
}

export interface LogicalFallacy {
  id: string;
  type: FallacyType;
  description: string;
  suggestion: string;
  confidence: number; // 0-1
  location: {
    start: number;
    end: number;
  };
  severity: 'low' | 'medium' | 'high';
}

export interface ArgumentMetrics {
  logicScore: number; // 0-10
  evidenceStrength: number; // 0-10
  coherenceRating: number; // 0-10
  counterArgumentConsideration: number; // 0-10
  overallQuality: number; // 0-10
}

export interface AIAnalysisResult {
  sectionId: string;
  logicScore: number;
  detectedFallacies: LogicalFallacy[];
  argumentMetrics: ArgumentMetrics;
  improvementSuggestions: string[];
  analysisVersion: number;
  analyzedAt: Date;
}

export interface UserSkillLevels {
  criticalThinking: number; // 0-100
  evidenceEvaluation: number; // 0-100
  argumentConstruction: number; // 0-100
  logicalCoherence: number; // 0-100
  fallacyRecognition: number; // 0-100
}

export interface LearningProgress extends BaseEntity {
  userId: string;
  user?: User;
  skillLevels: UserSkillLevels;
  completedTutorials: string[];
  practiceSessionsCompleted: number;
  improvementRate: number;
  weakAreas: string[];
  nextRecommendations: string[];
  totalContributions: number;
  qualityContributions: number;
  averageLogicScore: number;
}

export interface FallacyDefinition extends BaseEntity {
  fallacyType: FallacyType;
  name: string;
  description: string;
  examples: string[];
  howToAvoid: string;
  category: 'formal' | 'informal' | 'statistical';
  commonIn: string[];
}

export interface TutorialModule extends BaseEntity {
  title: string;
  description: string;
  category: 'fallacies' | 'argument_construction' | 'evidence_evaluation' | 'critical_thinking';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  exercises: TutorialExercise[];
  completionCriteria: string[];
  estimatedDuration: number; // minutes
}

export interface TutorialExercise {
  id: string;
  type: 'identify_fallacy' | 'construct_argument' | 'evaluate_evidence' | 'multiple_choice';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface LearningSession extends BaseEntity {
  userId: string;
  user?: User;
  moduleId: string;
  module?: TutorialModule;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  timeSpent: number; // minutes
  exerciseResults: ExerciseResult[];
  improvementAreas: string[];
}

export interface ExerciseResult {
  exerciseId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number; // seconds
  hintsUsed: number;
  score: number;
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
