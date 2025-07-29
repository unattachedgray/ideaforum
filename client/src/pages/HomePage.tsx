import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Document } from '@shared';

const GET_DOCUMENTS = gql`
  query GetDocuments($limit: Int, $offset: Int) {
    documents(limit: $limit, offset: $offset) {
      id
      title
      description
      author {
        id
        username
      }
      createdAt
    }
  }
`;

export const HomePage: React.FC = () => {
  const { data, loading, error } = useQuery<{ documents: Document[] }>(GET_DOCUMENTS, {
    variables: { limit: 10, offset: 0 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex space-x-1">
          <button className="nav-link active">Latest</button>
          <button className="nav-link">Top</button>
          <button className="nav-link">Trending</button>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {data?.documents.map((doc) => (
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
                      <span>0 views</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>💬</span>
                      <span>0 sections</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
