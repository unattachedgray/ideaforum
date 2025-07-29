import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '../store/AuthContext';

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

export const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionContent, setSectionContent] = useState('');
  const [parentSectionId, setParentSectionId] = useState<string | null>(null);
  
  const { loading, error, data, refetch } = useQuery(GET_DOCUMENT, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all'
  });

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

  const SectionComponent: React.FC<{ section: any; depth?: number }> = ({ section, depth = 0 }) => (
    <div className={`border-l-2 border-gray-200 ${depth > 0 ? 'ml-6 pl-4' : 'pl-4'} mb-4`}>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {section.author.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(section.createdAt)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Score: {section.voteScore}
            </span>
          </div>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 whitespace-pre-wrap">{section.content}</p>
        </div>
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

  return (
    <div className="max-w-4xl mx-auto p-6">
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => handleAddSection()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Section
            </button>
            {isAuthor && (
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Edit Document
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
        
        {document.sections && document.sections.length > 0 ? (
          <div>
            {document.sections
              .filter((section: any) => !section.parent) // Only show top-level sections
              .sort((a: any, b: any) => a.position - b.position)
              .map((section: any) => (
                <SectionComponent key={section.id} section={section} />
              ))}
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
    </div>
  );
};
