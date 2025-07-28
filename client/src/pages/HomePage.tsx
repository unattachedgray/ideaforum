import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Document } from '@shared/types';

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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Idea Forum</h1>
        <p className="mt-2 text-lg text-gray-600">Where discussions become knowledge.</p>
      </div>
      
      <div className="flex justify-end">
        <Link
          to="/document/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create New Document
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Recent Documents</h2>
        {data?.documents.map((doc) => (
          <div key={doc.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <Link to={`/document/${doc.id}`}>
              <h3 className="text-xl font-bold text-blue-700">{doc.title}</h3>
            </Link>
            <p className="text-gray-600 mt-1">{doc.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>By {doc.author?.username}</span>
              <span className="mx-2">|</span>
              <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
