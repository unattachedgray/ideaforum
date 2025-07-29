import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const ANALYZE_ARGUMENT = gql`
  mutation AnalyzeArgument($content: String!) {
    analyzeArgument(content: $content) {
      logicScore
      detectedFallacies {
        id
        type
        description
        suggestion
        confidence
        severity
      }
      argumentMetrics {
        logicScore
        evidenceStrength
        coherenceRating
        counterArgumentConsideration
        overallQuality
      }
      improvementSuggestions
    }
  }
`;

const REQUEST_SECTION_ANALYSIS = gql`
  mutation RequestSectionAnalysis($sectionId: ID!) {
    requestSectionAnalysis(sectionId: $sectionId) {
      logicScore
      detectedFallacies {
        id
        type
        description
        suggestion
        confidence
        severity
      }
      argumentMetrics {
        logicScore
        evidenceStrength
        coherenceRating
        counterArgumentConsideration
        overallQuality
      }
      improvementSuggestions
    }
  }
`;

interface LogicAnalysisPanelProps {
  sectionId?: string | undefined;
  content?: string | undefined;
  isVisible: boolean;
  onClose: () => void;
}

interface LogicalFallacy {
  id: string;
  type: string;
  description: string;
  suggestion: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

interface ArgumentMetrics {
  logicScore: number;
  evidenceStrength: number;
  coherenceRating: number;
  counterArgumentConsideration: number;
  overallQuality: number;
}

interface AnalysisResult {
  logicScore: number;
  detectedFallacies: LogicalFallacy[];
  argumentMetrics: ArgumentMetrics;
  improvementSuggestions: string[];
}

export const LogicAnalysisPanel: React.FC<LogicAnalysisPanelProps> = ({
  sectionId,
  content,
  isVisible,
  onClose
}) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisText, setAnalysisText] = useState(content || '');

  const [analyzeArgument, { loading: analyzingArgument }] = useMutation(ANALYZE_ARGUMENT, {
    onCompleted: (data) => {
      setAnalysisResult(data.analyzeArgument);
    },
    onError: (error) => {
      console.error('Error analyzing argument:', error);
    }
  });

  const [requestSectionAnalysis, { loading: analyzingSection }] = useMutation(REQUEST_SECTION_ANALYSIS, {
    onCompleted: (data) => {
      setAnalysisResult(data.requestSectionAnalysis);
    },
    onError: (error) => {
      console.error('Error analyzing section:', error);
    }
  });

  const handleAnalyze = () => {
    if (sectionId) {
      requestSectionAnalysis({ variables: { sectionId } });
    } else if (analysisText.trim()) {
      analyzeArgument({ variables: { content: analysisText.trim() } });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              🧠 Logic Analysis
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Phase 2 Demo
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content Input (if not analyzing a specific section) */}
          {!sectionId && (
            <div className="mb-6">
              <label htmlFor="analysis-text" className="block text-sm font-medium text-gray-700 mb-2">
                Text to Analyze
              </label>
              <textarea
                id="analysis-text"
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the argument or text you'd like to analyze for logical fallacies..."
              />
            </div>
          )}

          {/* Analyze Button */}
          <div className="mb-6">
            <button
              onClick={handleAnalyze}
              disabled={analyzingArgument || analyzingSection || (!sectionId && !analysisText.trim())}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzingArgument || analyzingSection ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Logic'
              )}
            </button>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Logic Score</h3>
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.logicScore)}`}>
                    {analysisResult.logicScore.toFixed(1)}/10
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          analysisResult.logicScore >= 8 ? 'bg-green-500' :
                          analysisResult.logicScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(analysisResult.logicScore / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Fallacies */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Detected Logical Fallacies ({analysisResult.detectedFallacies.length})
                </h3>
                {analysisResult.detectedFallacies.length > 0 ? (
                  <div className="space-y-3">
                    {analysisResult.detectedFallacies.map((fallacy) => (
                      <div
                        key={fallacy.id}
                        className={`border rounded-lg p-4 ${getSeverityColor(fallacy.severity)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold capitalize">
                            {fallacy.type.replace(/_/g, ' ')}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                              {Math.round(fallacy.confidence * 100)}% confident
                            </span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              fallacy.severity === 'high' ? 'bg-red-200 text-red-800' :
                              fallacy.severity === 'medium' ? 'bg-orange-200 text-orange-800' :
                              'bg-yellow-200 text-yellow-800'
                            }`}>
                              {fallacy.severity}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{fallacy.description}</p>
                        <div className="text-sm">
                          <strong>💡 Suggestion:</strong> {fallacy.suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-green-600 bg-green-50 border border-green-200 rounded-lg p-4">
                    ✅ No logical fallacies detected! The argument appears to be logically sound.
                  </div>
                )}
              </div>

              {/* Argument Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Argument Quality Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResult.argumentMetrics.evidenceStrength)}`}>
                      {analysisResult.argumentMetrics.evidenceStrength.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Evidence Strength</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResult.argumentMetrics.coherenceRating)}`}>
                      {analysisResult.argumentMetrics.coherenceRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Coherence</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResult.argumentMetrics.counterArgumentConsideration)}`}>
                      {analysisResult.argumentMetrics.counterArgumentConsideration.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Counter-Arguments</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResult.argumentMetrics.overallQuality)}`}>
                      {analysisResult.argumentMetrics.overallQuality.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Overall Quality</div>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              {analysisResult.improvementSuggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    💡 Suggestions for Improvement
                  </h3>
                  <div className="space-y-2">
                    {analysisResult.improvementSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Phase 2 Demo Feature
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This is a demonstration of Phase 2 logic analysis capabilities. The current implementation uses mock AI analysis 
                        with pattern matching. In production, this would integrate with OpenAI's GPT-4 for sophisticated logical fallacy 
                        detection and argument quality assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
