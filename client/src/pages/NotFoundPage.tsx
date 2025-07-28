import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Go to Home
      </Link>
    </div>
  );
};
