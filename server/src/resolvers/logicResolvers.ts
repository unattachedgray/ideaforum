import { IResolvers } from '@graphql-tools/utils';
import { AIAnalysisResult, LogicalFallacy, FallacyType } from '../types/shared';
import { Context } from '../utils/context';
import { AuthenticationError } from 'apollo-server-express';
import { AIAnalysisService } from '../services/AIAnalysisService';

export const logicResolvers: IResolvers = {
  Query: {
    analyzeArgument: async (
      _: any,
      { content }: { content: string },
      _context: Context
    ): Promise<AIAnalysisResult> => {
      // Allow public access to logic analysis for educational purposes
      // Note: In production, you might want to add rate limiting instead of auth requirements
      
      return await AIAnalysisService.analyzeSection(content);
    },

    getAIStatus: async (): Promise<{ available: boolean; model: string; configured: boolean }> => {
      return AIAnalysisService.getStatus();
    },

    getFallacyDefinitions: async (): Promise<Array<{ type: string; name: string; description: string; examples: string[] }>> => {
      // Return hardcoded fallacy definitions for now
      return [
        {
          type: FallacyType.AD_HOMINEM,
          name: 'Ad Hominem',
          description: 'Attacking the person making the argument rather than the argument itself',
          examples: [
            'You\'re wrong because you\'re not smart enough to understand this',
            'Don\'t listen to him, he\'s just a teenager'
          ]
        },
        {
          type: FallacyType.STRAW_MAN,
          name: 'Straw Man',
          description: 'Misrepresenting someone\'s argument to make it easier to attack',
          examples: [
            'People who support environmental protection want to destroy the economy',
            'Those who want gun control want to take away all guns'
          ]
        },
        {
          type: FallacyType.FALSE_DILEMMA,
          name: 'False Dilemma',
          description: 'Presenting only two options when more alternatives exist',
          examples: [
            'You\'re either with us or against us',
            'We must either ban all cars or accept pollution'
          ]
        },
        {
          type: FallacyType.SLIPPERY_SLOPE,
          name: 'Slippery Slope',
          description: 'Assuming one thing will inevitably lead to a chain of negative consequences',
          examples: [
            'If we allow this small tax increase, soon we\'ll have crushing taxation',
            'If we permit this exception, chaos will follow'
          ]
        },
        {
          type: FallacyType.APPEAL_TO_AUTHORITY,
          name: 'Appeal to Authority',
          description: 'Accepting a claim because an authority figure endorses it, without considering their expertise in the relevant field',
          examples: [
            'A famous actor says this diet works, so it must be effective',
            'The CEO believes this, so it must be true'
          ]
        }
      ];
    }
  },

  Mutation: {
    requestSectionAnalysis: async (
      _: any,
      { sectionId }: { sectionId: string },
      { user, dataLoaders }: Context
    ): Promise<AIAnalysisResult> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to request analysis');
      }

      const section = await dataLoaders.sectionLoader.load(sectionId);
      if (!section) {
        throw new Error('Section not found');
      }

      const analysis = await AIAnalysisService.analyzeSection(section.content);
      analysis.sectionId = sectionId;

      return analysis;
    },

    batchAnalyzeSections: async (
      _: any,
      { sectionIds }: { sectionIds: string[] },
      { user, dataLoaders }: Context
    ): Promise<AIAnalysisResult[]> => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to request analysis');
      }

      const sections = await Promise.all(
        sectionIds.map(id => dataLoaders.sectionLoader.load(id))
      );

      const validSections = sections
        .filter(section => section !== null)
        .map(section => ({ id: section!.id, content: section!.content }));

      return await AIAnalysisService.batchAnalyze(validSections);
    }
  },

  // Type resolvers
  AIAnalysisResult: {
    detectedFallacies: (parent: AIAnalysisResult) => parent.detectedFallacies || [],
    improvementSuggestions: (parent: AIAnalysisResult) => parent.improvementSuggestions || []
  },

  LogicalFallacy: {
    type: (parent: LogicalFallacy) => parent.type,
    description: (parent: LogicalFallacy) => parent.description,
    suggestion: (parent: LogicalFallacy) => parent.suggestion,
    confidence: (parent: LogicalFallacy) => parent.confidence,
    severity: (parent: LogicalFallacy) => parent.severity
  },

  ArgumentMetrics: {
    logicScore: (parent: any) => Math.round(parent.logicScore * 10) / 10, // Round to 1 decimal
    evidenceStrength: (parent: any) => Math.round(parent.evidenceStrength * 10) / 10,
    coherenceRating: (parent: any) => Math.round(parent.coherenceRating * 10) / 10,
    counterArgumentConsideration: (parent: any) => Math.round(parent.counterArgumentConsideration * 10) / 10,
    overallQuality: (parent: any) => Math.round(parent.overallQuality * 10) / 10
  }
};
