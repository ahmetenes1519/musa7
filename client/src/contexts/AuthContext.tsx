import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for mock user first (demo mode)
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          try {
            const parsedUser = JSON.parse(mockUser);
            if (mounted) {
              console.log('🔄 Loading mock user from localStorage:', parsedUser.name);
              setUser(parsedUser);
              setLoading(false);
            }
            return;
          } catch (parseError) {
            console.warn('Invalid mock user data, clearing:', parseError);
            localStorage.removeItem('mockUser');
          }
        }

        // Using API client instead of Supabase
        console.log('Using demo mode with API client');
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for mock login events
    const handleMockLogin = (event: CustomEvent) => {
      if (mounted) {
        console.log('🔄 Mock login event received:', event.detail.name);
        setUser(event.detail);
        setLoading(false);
      }
    };

    window.addEventListener('mockLogin', handleMockLogin as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('mockLogin', handleMockLogin as EventListener);
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);

      const { data, error } = await apiClient.getUser(userId);

      if (error) {
        console.warn('Error fetching user profile:', error);
      } else if (data) {
        console.log('User profile loaded:', (data as AuthUser).name);
        setUser(data as AuthUser);
      }
    } catch (error) {
      console.warn('Profile fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      setLoading(true);
      console.log('Signing up user:', email);
      
      const userData = {
        email,
        name: metadata.full_name || metadata.name || 'User',
        username: metadata.username || email.split('@')[0],
        role: 'user'
      };
      
      const { data, error } = await apiClient.signUp(userData);
      
      if (error) throw error;
      
      console.log('User signed up successfully');
      return { data, error: null };
    } catch (error: any) {
      console.warn('Sign up error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in user:', email);
      
      const { data, error } = await apiClient.signIn({ email, password });
      
      if (error) throw error;
      
      if (data) {
        setUser(data as AuthUser);
        console.log('User signed in successfully');
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.warn('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('Signing out user...');
    
    // Clear mock user and any stored auth data
    localStorage.removeItem('mockUser');
    setUser(null);
    
    console.log('User signed out successfully');
  };

  const updateUser = (userData: any) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      
      // Update localStorage if it's a mock user
      if (prev.id.startsWith('demo-')) {
        localStorage.setItem('mockUser', JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};