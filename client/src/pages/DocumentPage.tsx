import React from 'react';
import { useParams } from 'react-router-dom';

export const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <div>Document Page for ID: {id}</div>;
};
