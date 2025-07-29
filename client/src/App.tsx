import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './utils/apollo';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './store/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { HandleLoginTokenPage } from './pages/HandleLoginTokenPage';
import { RegisterPage } from './pages/RegisterPage';
import { DocumentPage } from './pages/DocumentPage';
import { CreateDocumentPage } from './pages/CreateDocumentPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login/token/:token" element={<HandleLoginTokenPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                      path="/document/new" 
                      element={
                        <ProtectedRoute>
                          <CreateDocumentPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/document/:id" element={<DocumentPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </AuthProvider>
        </ApolloProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
