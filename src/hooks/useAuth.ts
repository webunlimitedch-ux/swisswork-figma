import { useState, useEffect, useCallback } from 'react';
import type { User, UserProfile } from '../types';
import { auth } from '../lib/supabase';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    accessToken: null,
    loading: true,
    error: null,
  });

  const fetchUserProfile = useCallback(async (userId: string) => {
    const response = await api.getProfile(userId);
    if (response.data) {
      setState(prev => ({ ...prev, userProfile: response.data! }));
    }
  }, []);

  const checkUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await auth.getSession();
      if (session?.user) {
        setState(prev => ({
          ...prev,
          user: session.user as User,
          accessToken: session.access_token,
        }));
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
      setState(prev => ({ ...prev, error: 'Failed to check authentication' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchUserProfile]);

  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
      setState({
        user: null,
        userProfile: null,
        accessToken: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({ ...prev, error: 'Failed to sign out' }));
    }
  }, []);

  const updateProfile = useCallback((profile: UserProfile) => {
    setState(prev => ({ ...prev, userProfile: profile }));
  }, []);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setState({
          user: null,
          userProfile: null,
          accessToken: null,
          loading: false,
          error: null,
        });
      } else if (session?.user) {
        setState(prev => ({
          ...prev,
          user: session.user as User,
          accessToken: session.access_token,
        }));
        fetchUserProfile(session.user.id);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [checkUser, fetchUserProfile]);

  return {
    ...state,
    signOut,
    updateProfile,
    refetchProfile: () => state.user && fetchUserProfile(state.user.id),
  };
}