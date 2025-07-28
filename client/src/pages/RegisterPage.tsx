import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Registration</h1>
      <p className="mt-4">With passwordless login, you can simply enter your email on the <Link to="/login" className="text-blue-600 hover:underline">login page</Link> to get started.</p>
    </div>
  );
};
