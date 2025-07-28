import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-md mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Idea Forum. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
