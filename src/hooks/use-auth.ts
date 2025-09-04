'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { User, UserProfile } from '@/types'

interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  accessToken: string | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    accessToken: null,
    loading: true,
    error: null,
  })

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const profile = await api.getProfile(userId)
      setState(prev => ({ ...prev, userProfile: profile }))
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [])

  const checkUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error

      if (session?.user) {
        setState(prev => ({
          ...prev,
          user: session.user as User,
          accessToken: session.access_token,
        }))
        await fetchUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error checking user session:', error)
      setState(prev => ({ ...prev, error: 'Failed to check authentication' }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [fetchUserProfile])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setState({
        user: null,
        userProfile: null,
        accessToken: null,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error signing out:', error)
      setState(prev => ({ ...prev, error: 'Failed to sign out' }))
    }
  }, [])

  const updateProfile = useCallback((profile: UserProfile) => {
    setState(prev => ({ ...prev, userProfile: profile }))
  }, [])

  useEffect(() => {
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setState({
            user: null,
            userProfile: null,
            accessToken: null,
            loading: false,
            error: null,
          })
        } else if (session?.user) {
          setState(prev => ({
            ...prev,
            user: session.user as User,
            accessToken: session.access_token,
          }))
          await fetchUserProfile(session.user.id)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [checkUser, fetchUserProfile])

  return {
    ...state,
    signOut,
    updateProfile,
    refetchProfile: () => state.user && fetchUserProfile(state.user.id),
  }
}