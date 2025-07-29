// Shared types for logic analysis - copied from shared/types
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

// Markup types
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
