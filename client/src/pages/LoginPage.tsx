import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { AuthPayload } from '@shared';
import { GoogleLogin } from '@react-oauth/google';

const REQUEST_LOGIN_LINK_MUTATION = gql`
  mutation RequestLoginLink($email: String!) {
    requestLoginLink(email: $email)
  }
`;

const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation LoginWithGoogle($input: GoogleLoginInput!) {
    loginWithGoogle(input: $input) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [requestLoginLink, { loading: emailLoading }] = useMutation(REQUEST_LOGIN_LINK_MUTATION);
  const [loginWithGoogle] = useMutation<{ loginWithGoogle: AuthPayload }>(LOGIN_WITH_GOOGLE_MUTATION);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await requestLoginLink({ variables: { email } });
      setMessage(`Login link sent to ${email}. Please check your inbox.`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setMessage('');
    try {
      const { data } = await loginWithGoogle({
        variables: { input: { token: credentialResponse.credential } },
      });
      if (data) {
        login(data.loginWithGoogle.token, data.loginWithGoogle.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Login or Register</h2>
      <div className="space-y-4 bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={emailLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {emailLoading ? 'Sending...' : 'Send Login Link'}
          </button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError('Google login failed. Please try again.');
            }}
          />
        </div>

        {message && <p className="text-green-500 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};
