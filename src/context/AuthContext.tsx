import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider: string;
  role: 'USER' | 'ADMIN';
  status: string;
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
  bio?: string;
  website?: string;
  company?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  setAuthTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  updateUserProfile: (data: { fullName?: string; phone?: string; avatar?: string; bio?: string; website?: string; company?: string; location?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  setAuthTokens: async () => {},
  updateUserProfile: async () => {},
});

const ACCESS_TOKEN_KEY = 'primenova_token';
const REFRESH_TOKEN_KEY = 'primenova_refresh_token';

const getStoredToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);
const getStoredRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);

/** True when the tokens live in localStorage (remember-me / OAuth), false for sessionStorage. */
const isPersistent = () => !!localStorage.getItem(REFRESH_TOKEN_KEY);

const clearStoredTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(getStoredRefreshToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const storeTokens = (accessToken: string, rToken: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, rToken);
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(ACCESS_TOKEN_KEY);
    other.removeItem(REFRESH_TOKEN_KEY);
    setToken(accessToken);
    setRefreshToken(rToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    clearStoredTokens();
  };

  /**
   * Exchanges the stored refresh token for a fresh access token. Returns the
   * new access token, or null (and logs out) when the refresh token is missing,
   * expired, or rejected by the server.
   */
  const refreshAccessToken = async (): Promise<string | null> => {
    const rToken = getStoredRefreshToken();
    if (!rToken) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rToken }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.accessToken) {
        logout();
        return null;
      }
      storeTokens(data.accessToken, data.refreshToken || rToken, isPersistent());
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  // Fetch current user profile if token exists
  const fetchProfile = async (currentToken: string, retried = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401 && !retried) {
        // Access token expired — refresh once and retry before giving up.
        const freshToken = await refreshAccessToken();
        if (freshToken) {
          await fetchProfile(freshToken, true);
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentToken = getStoredToken();
    if (currentToken) {
      fetchProfile(currentToken);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Silent periodic refresh: access tokens live 15 minutes; refresh shortly
  // before expiry so sessions never die mid-use. Only runs while signed in.
  useEffect(() => {
    if (!refreshToken) return;
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 8 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      throw new Error(data.message || 'Login failed');
    }

    storeTokens(data.accessToken, data.refreshToken, rememberMe);
    setUser(data.user);
    setIsLoading(false);
  };

  const signup = async (fullName: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone }),
    });

    const data = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      throw new Error(data.message || 'Signup failed');
    }

    // Email verification check: if accessToken is null, verification is required
    if (!data.accessToken) {
      setIsLoading(false);
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      throw new Error("Welcome to PrimeNova Studio 🚀\n\nPlease verify your email. A verification link has been sent to your inbox.");
    }

    // Default signup to sessionStorage (session only)
    storeTokens(data.accessToken, data.refreshToken, false);
    setUser(data.user);
    setIsLoading(false);
  };

  const setAuthTokens = async (accessToken: string, rToken: string) => {
    // OAuth callback logins persist (localStorage) so a browser refresh keeps the session.
    storeTokens(accessToken, rToken, true);
    await fetchProfile(accessToken);
  };

  const updateUserProfile = async (data: { fullName?: string; phone?: string; avatar?: string; bio?: string; website?: string; company?: string; location?: string }) => {
    const currentToken = getStoredToken();
    if (!currentToken) return;
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const updatedUser = await response.json();
    if (!response.ok) {
      throw new Error(updatedUser.message || 'Failed to update profile');
    }
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: token || getStoredToken(),
        isLoading,
        login,
        signup,
        logout,
        setAuthTokens,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
