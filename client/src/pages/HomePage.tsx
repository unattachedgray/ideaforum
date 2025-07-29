import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Document } from '@shared';
import { useAuth } from '../store/AuthContext';

const GET_DOCUMENTS = gql`
  query GetDocuments($limit: Int, $offset: Int) {
    documents(limit: $limit, offset: $offset) {
      id
      title
      description
      isPublic
      tags
      viewCount
      lastActivityAt
      author {
        id
        username
      }
      createdAt
      sections {
        id
      }
    }
  }
`;

const SEARCH_DOCUMENTS = gql`
  query SearchDocuments($query: String!, $limit: Int, $offset: Int) {
    searchDocuments(query: $query, limit: $limit, offset: $offset) {
      id
      title
      description
      isPublic
      tags
      viewCount
      lastActivityAt
      author {
        id
        username
      }
      createdAt
      sections {
        id
      }
    }
  }
`;

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { data, loading, error } = useQuery<{ documents: Document[] }>(GET_DOCUMENTS, {
    variables: { limit: 10, offset: 0 },
    skip: isSearching
  });
  
  const { data: searchData, loading: searchLoading, error: searchError } = useQuery<{ searchDocuments: Document[] }>(SEARCH_DOCUMENTS, {
    variables: { query: searchQuery, limit: 10, offset: 0 },
    skip: !isSearching || !searchQuery.trim()
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const displayData = isSearching ? searchData?.searchDocuments : data?.documents;
  const displayLoading = isSearching ? searchLoading : loading;
  const displayError = isSearching ? searchError : error;

  if (displayLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Documents</h2>
          <p className="text-red-700">{displayError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Idea Forum</h1>
        <p className="text-lg text-gray-600 mb-8">Where discussions become knowledge.</p>
        <Link
          to="/document/new"
          className="btn-primary"
        >
          Create New Document
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            🔍 Search
          </button>
          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear
            </button>
          )}
        </form>
        {isSearching && (
          <div className="mt-2 text-sm text-gray-600">
            Searching for: "<span className="font-medium">{searchQuery}</span>"
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex space-x-1">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'latest' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('latest')}
          >
            Latest
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'top' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('top')}
          >
            Top
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'trending' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            Trending
          </button>
        </div>
        {user && (
          <div className="text-sm text-gray-600">
            Welcome back, {user.username}!
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {displayData && displayData.length > 0 ? (
          displayData.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="section-avatar">
                  {doc.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link to={`/document/${doc.id}`}>
                    <h3 className="document-card-title">{doc.title}</h3>
                  </Link>
                  <p className="document-card-description">{doc.description}</p>
                  
                  {/* Meta Information */}
                  <div className="document-card-meta">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {doc.author?.username || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <span>👁</span>
                        <span>{doc.viewCount || 0} views</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>{doc.sections?.length || 0} sections</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {isSearching ? 'No search results' : 'No documents yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {isSearching 
                ? `No documents found for "${searchQuery}". Try a different search term.`
                : 'Get started by creating your first document.'
              }
            </p>
            {!isSearching && (
              <Link
                to="/document/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create First Document
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
