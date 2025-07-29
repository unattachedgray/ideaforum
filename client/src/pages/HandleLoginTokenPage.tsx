import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../store/AuthContext';
import { AuthPayload } from '@shared';

const LOGIN_WITH_TOKEN_MUTATION = gql`
  mutation LoginWithToken($token: String!) {
    loginWithToken(token: $token) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const HandleLoginTokenPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const [loginWithToken, { loading }] = useMutation<{ loginWithToken: AuthPayload }>(LOGIN_WITH_TOKEN_MUTATION);

  useEffect(() => {
    const handleLogin = async () => {
      if (token) {
        try {
          const { data } = await loginWithToken({ variables: { token } });
          if (data) {
            login(data.loginWithToken.token, data.loginWithToken.user);
            navigate('/');
          }
        } catch (err: any) {
          setError(err.message);
        }
      }
    };
    handleLogin();
  }, [token, loginWithToken, login, navigate]);

  if (loading) return <p>Verifying login...</p>;
  if (error) return <p>Error: {error}</p>;

  return <p>Redirecting...</p>;
};
