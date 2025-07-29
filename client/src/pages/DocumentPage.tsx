import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { useAuth } from '../store/AuthContext';
import { LogicAnalysisPanel } from '../components/LogicAnalysisPanel';
import { ClientMarkupParser } from '../utils/markupParser';

const GET_DOCUMENT = gql`
  query GetDocument($id: ID!) {
    document(id: $id) {
      id
      title
      description
      isPublic
      tags
      viewCount
      lastActivityAt
      createdAt
      author {
        id
        username
      }
      sections {
        id
        content
        position
        voteScore
        author {
          id
          username
        }
        createdAt
        children {
          id
          content
          position
          voteScore
          author {
            id
            username
          }
          createdAt
        }
      }
    }
  }
`;

const CREATE_SECTION = gql`
  mutation CreateSection($input: SectionInput!) {
    createSection(input: $input) {
      id
      content
      position
      voteScore
      author {
        id
        username
      }
      createdAt
    }
  }
`;

const CAST_VOTE = gql`
  mutation CastVote($input: VoteInput!) {
    castVote(input: $input) {
      id
      type
      value
    }
  }
`;

const SECTION_ADDED_SUBSCRIPTION = gql`
  subscription SectionAdded($documentId: ID!) {
    sectionAdded(documentId: $documentId) {
      id
      content
      position
      voteScore
      author {
        id
        username
      }
      createdAt
    }
  }
`;

const SECTION_UPDATED_SUBSCRIPTION = gql`
  subscription SectionUpdated($documentId: ID!) {
    sectionUpdated(documentId: $documentId) {
      id
      content
      position
      voteScore
      author {
        id
        username
      }
      createdAt
    }
  }
`;

const VOTE_CASTED_SUBSCRIPTION = gql`
  subscription VoteCasted($documentId: ID!) {
    voteCasted(documentId: $documentId) {
      id
      type
      value
      section {
        id
        voteScore
      }
    }
  }
`;

export const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionContent, setSectionContent] = useState('');
  const [parentSectionId, setParentSectionId] = useState<string | null>(null);
  const [realtimeActivity, setRealtimeActivity] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'thread' | 'wiki'>('thread');
  const [showLogicAnalysis, setShowLogicAnalysis] = useState(false);
  const [analysisTarget, setAnalysisTarget] = useState<{ sectionId?: string; content?: string }>({});
  
  const { loading, error, data, refetch } = useQuery(GET_DOCUMENT, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all'
  });

  // Real-time subscriptions
  useSubscription(SECTION_ADDED_SUBSCRIPTION, {
    variables: { documentId: id },
    skip: !id,
    onData: ({ data }) => {
      if (data?.data?.sectionAdded) {
        setRealtimeActivity(`New section added by ${data.data.sectionAdded.author.username}`);
        refetch(); // Refresh document data
        setTimeout(() => setRealtimeActivity(null), 3000);
      }
    }
  });

  useSubscription(SECTION_UPDATED_SUBSCRIPTION, {
    variables: { documentId: id },
    skip: !id,
    onData: ({ data }) => {
      if (data?.data?.sectionUpdated) {
        setRealtimeActivity(`Section updated by ${data.data.sectionUpdated.author.username}`);
        refetch(); // Refresh document data
        setTimeout(() => setRealtimeActivity(null), 3000);
      }
    }
  });

  useSubscription(VOTE_CASTED_SUBSCRIPTION, {
    variables: { documentId: id },
    skip: !id,
    onData: ({ data }) => {
      if (data?.data?.voteCasted) {
        setRealtimeActivity(`Vote cast on section`);
        refetch(); // Refresh document data to show updated vote scores
        setTimeout(() => setRealtimeActivity(null), 3000);
      }
    }
  });

  // Show connection status
  useEffect(() => {
    if (id) {
      console.log('📡 Subscribed to real-time updates for document:', id);
    }
  }, [id]);

  const [createSection, { loading: createLoading }] = useMutation(CREATE_SECTION, {
    onCompleted: () => {
      setShowSectionModal(false);
      setSectionContent('');
      setParentSectionId(null);
      refetch(); // Refresh the document data
    },
    onError: (error) => {
      console.error('Error creating section:', error);
    }
  });

  const [castVote] = useMutation(CAST_VOTE, {
    onCompleted: () => {
      refetch(); // Refresh to show updated vote scores
    },
    onError: (error) => {
      console.error('Error casting vote:', error);
    }
  });

  const handleSaveDocument = () => {
    console.log('Document editing functionality to be implemented');
    setEditMode(false);
  };

  const updateLoading = false; // Placeholder for future document update mutation

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Invalid document ID</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Document</h2>
          <p className="text-red-700">{error.message}</p>
          <Link 
            to="/" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data?.document) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Document Not Found</h2>
          <p className="text-yellow-700">The document you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link 
            to="/" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const document = data.document;
  const isAuthor = user?.id === document.author.id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddSection = (parentId?: string) => {
    if (!user) {
      alert('Please log in to add a section');
      return;
    }
    setParentSectionId(parentId || null);
    setShowSectionModal(true);
  };

  const handleSubmitSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionContent.trim()) return;

    try {
      await createSection({
        variables: {
          input: {
            documentId: id,
            content: sectionContent.trim(),
            parentId: parentSectionId,
            position: 0, // Will be handled by the backend
            metadata: {
              wikiVisibility: false,
              status: 'ACTIVE',
              threadDepth: parentSectionId ? 1 : 0
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleVote = async (sectionId: string, type: 'UP' | 'DOWN' | 'PROMOTE') => {
    if (!user) {
      alert('Please log in to vote');
      return;
    }

    try {
      await castVote({
        variables: {
          input: {
            sectionId,
            type
          }
        }
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  // Enhanced Section Component with markup parsing
  const SectionComponent: React.FC<{ section: any; depth?: number }> = ({ section, depth = 0 }) => {
    const parsedContent = ClientMarkupParser.parseContent(section.content);
    const blocksForView = ClientMarkupParser.renderForView(parsedContent.blocks, viewMode);
    const metadata = ClientMarkupParser.extractMetadata(parsedContent.blocks);

    // In wiki view, only show sections that have wiki-visible content
    if (viewMode === 'wiki' && !ClientMarkupParser.isWikiVisible(parsedContent.blocks)) {
      return null;
    }

    const MarkupBlockComponent: React.FC<{ block: any }> = ({ block }) => {
      const getBlockStyle = () => {
        switch (block.type) {
          case 'consensus':
            const consensusLevel = Math.round((block.attributes?.consensusLevel || 0) * 100);
            return {
              className: 'bg-green-50 border-l-4 border-green-400 p-3 mb-3',
              header: `📊 Consensus: ${consensusLevel}%`
            };
          case 'debate':
            return {
              className: 'bg-orange-50 border-l-4 border-orange-400 p-3 mb-3',
              header: `🔥 Active Debate: ${block.attributes?.debateTopic || 'General'}`
            };
          case 'synthesis':
            const sources = block.attributes?.sources || [];
            return {
              className: 'bg-blue-50 border-l-4 border-blue-400 p-3 mb-3',
              header: `🔗 Synthesis from: ${Array.isArray(sources) ? sources.join(', ') : sources}`
            };
          case 'wiki-primary':
            return {
              className: 'bg-purple-50 border-l-4 border-purple-400 p-3 mb-3',
              header: viewMode === 'wiki' ? '📖 Primary Content' : null
            };
          case 'thread-only':
            return {
              className: 'bg-gray-50 border-l-4 border-gray-400 p-3 mb-3',
              header: '💬 Discussion Only'
            };
          default:
            return { className: 'mb-3', header: null };
        }
      };

      const style = getBlockStyle();
      
      return (
        <div className={style.className}>
          {style.header && (
            <div className="text-sm font-semibold text-gray-700 mb-2">
              {style.header}
            </div>
          )}
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {block.content}
          </div>
        </div>
      );
    };

    return (
      <div className={`border-l-2 ${depth > 0 ? 'border-blue-200 ml-6 pl-4' : 'border-gray-200 pl-4'} mb-4`}>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                {section.author.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {section.author.username}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(section.createdAt)}
              </span>
              {depth > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Reply
                </span>
              )}
              {/* Show markup indicators */}
              {metadata.hasConsensus && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  📊 Consensus
                </span>
              )}
              {metadata.hasActiveDebate && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  🔥 Debate
                </span>
              )}
              {metadata.hasSynthesis && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  🔗 Synthesis
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Score: {section.voteScore}
              </span>
              {user && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleVote(section.id, 'UP')}
                    className="text-gray-400 hover:text-green-600 text-sm"
                    title="Upvote"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleVote(section.id, 'DOWN')}
                    className="text-gray-400 hover:text-red-600 text-sm"
                    title="Downvote"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleVote(section.id, 'PROMOTE')}
                    className="text-gray-400 hover:text-blue-600 text-xs ml-2"
                    title="Promote to Wiki"
                  >
                    ★
                  </button>
                  <button
                    onClick={() => {
                      setAnalysisTarget({ sectionId: section.id, content: section.content });
                      setShowLogicAnalysis(true);
                    }}
                    className="text-gray-400 hover:text-purple-600 text-xs ml-2"
                    title="Analyze Logic"
                  >
                    🧠
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Render content blocks based on view mode */}
          <div className="prose prose-sm max-w-none mb-3">
            {blocksForView.length > 0 ? (
              blocksForView.map((block: any, index: number) => (
                <MarkupBlockComponent key={index} block={block} />
              ))
            ) : (
              <div className="text-gray-500 italic">
                {viewMode === 'wiki' ? 'No wiki content available' : 'No content available'}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleAddSection(section.id)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                💬 Reply
              </button>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                {section.children?.length || 0} replies
              </span>
            </div>
          )}
        </div>
        
        {/* Render child sections */}
        {section.children && section.children.length > 0 && (
          <div className="mt-2">
            {section.children
              .sort((a: any, b: any) => a.position - b.position)
              .map((child: any) => (
                <SectionComponent key={child.id} section={child} depth={depth + 1} />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Real-time Activity Notification */}
      {realtimeActivity && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-sm">{realtimeActivity}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
              {document.description && (
                <p className="text-gray-600 text-lg mb-4">{document.description}</p>
              )}
            </div>
            {isAuthor && (
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Your Document
                </span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <span>By {document.author.username}</span>
            <span>•</span>
            <span>Created {formatDate(document.createdAt)}</span>
            <span>•</span>
            <span>{document.viewCount} views</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              document.isPublic 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {document.isPublic ? 'Public' : 'Private'}
            </span>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {document.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('thread')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'thread' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🧵 Thread View
              </button>
              <button
                onClick={() => setViewMode('wiki')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'wiki' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📖 Wiki View
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => handleAddSection()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Section
            </button>
            {isAuthor && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {editMode ? 'Cancel Edit' : 'Edit Document'}
                </button>
                {editMode && (
                  <button 
                    onClick={handleSaveDocument}
                    disabled={updateLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {viewMode === 'wiki' ? 'Knowledge Base' : 'Sections'}
        </h2>
        
        {document.sections && document.sections.length > 0 ? (
          <div>
            {viewMode === 'wiki' ? (
              // Wiki View: Basic format for now - will enhance shortly
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {document.sections
                    .filter((section: any) => !section.parent)
                    .sort((a: any, b: any) => b.voteScore - a.voteScore)
                    .map((section: any, index: number) => (
                      <div key={section.id} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">
                                By {section.author.username} • {formatDate(section.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <span className="text-green-600">▲</span>
                              <span>{section.voteScore}</span>
                            </div>
                            {user && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleVote(section.id, 'UP')}
                                  className="text-gray-400 hover:text-green-600 text-xs"
                                  title="Upvote"
                                >
                                  ▲
                                </button>
                                <button
                                  onClick={() => handleVote(section.id, 'PROMOTE')}
                                  className="text-gray-400 hover:text-blue-600 text-xs"
                                  title="Promote"
                                >
                                  ★
                                </button>
                                <button
                                  onClick={() => {
                                    setAnalysisTarget({ sectionId: section.id, content: section.content });
                                    setShowLogicAnalysis(true);
                                  }}
                                  className="text-gray-400 hover:text-purple-600 text-xs ml-2"
                                  title="Analyze Logic"
                                >
                                  🧠
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {section.content}
                          </div>
                        </div>
                        {section.children && section.children.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-100">
                            <div className="text-sm text-gray-600 mb-2">
                              {section.children.length} related discussion{section.children.length !== 1 ? 's' : ''}
                            </div>
                            <div className="space-y-2">
                              {section.children
                                .sort((a: any, b: any) => b.voteScore - a.voteScore)
                                .slice(0, 3)
                                .map((child: any) => (
                                  <div key={child.id} className="text-sm bg-gray-50 p-3 rounded">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-medium text-gray-700">{child.author.username}:</span>
                                      <div className="flex items-center space-x-1">
                                        <span className="text-xs text-gray-500">{child.voteScore}</span>
                                        {user && (
                                          <>
                                            <button
                                              onClick={() => handleVote(child.id, 'UP')}
                                              className="text-gray-400 hover:text-green-600 text-xs"
                                              title="Upvote"
                                            >
                                              ▲
                                            </button>
                                            <button
                                              onClick={() => {
                                                setAnalysisTarget({ sectionId: child.id, content: child.content });
                                                setShowLogicAnalysis(true);
                                              }}
                                              className="text-gray-400 hover:text-purple-600 text-xs ml-1"
                                              title="Analyze Logic"
                                            >
                                              🧠
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-gray-600">
                                      {child.content.length > 150 ? child.content.slice(0, 150) + '...' : child.content}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              // Thread View: Conversational format
              <div>
                {document.sections
                  .filter((section: any) => !section.parent)
                  .sort((a: any, b: any) => a.position - b.position)
                  .map((section: any) => (
                    <SectionComponent key={section.id} section={section} />
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No sections yet. Be the first to contribute!</p>
            <button 
              onClick={() => handleAddSection()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add First Section
            </button>
          </div>
        )}
      </div>

      {/* Section Creation Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {parentSectionId ? 'Add Reply' : 'Add New Section'}
                </h2>
                <button
                  onClick={() => setShowSectionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitSection}>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={sectionContent}
                    onChange={(e) => setSectionContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your section content here..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSectionModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading || !sectionContent.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createLoading ? 'Creating...' : 'Create Section'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Logic Analysis Panel */}
      <LogicAnalysisPanel
        sectionId={analysisTarget.sectionId}
        content={analysisTarget.content}
        isVisible={showLogicAnalysis}
        onClose={() => {
          setShowLogicAnalysis(false);
          setAnalysisTarget({});
        }}
      />
    </div>
  );
};
