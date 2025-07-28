import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Idea Forum
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            {/* Add nav links here if needed */}
          </nav>
          <div className="flex items-center">
            {user ? (
              <>
                <span className="mr-4 text-gray-600">Welcome, {user.username}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
