import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setAuthTokens } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      navigate(`/login?error=${encodeURIComponent(errorParam)}`, { replace: true });
      return;
    }

    if (token && refreshToken) {
      setAuthTokens(token, refreshToken)
        .then(() => {
          navigate('/profile', { replace: true });
        })
        .catch(() => {
          navigate('/login?error=oauth_failed', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, setAuthTokens, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Completing Google Sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
