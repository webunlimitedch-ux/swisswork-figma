'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
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

  const supabase = createClient()

  const fetchUserProfile = useCallback(async (userId: string) => {
    // Skip if no Supabase client
    if (!supabase) return
    
    try {
      // In demo mode, we don't fetch real profiles
      console.log('Profile fetch would happen for user:', userId)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [supabase])

  const checkUser = useCallback(async () => {
    try {
      // Skip auth check if no Supabase client
      if (!supabase) {
        setState(prev => ({ ...prev, loading: false }))
        return
      }

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
  }, [supabase, fetchUserProfile])

  const signOut = useCallback(async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
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
  }, [supabase])

  const updateProfile = useCallback((profile: UserProfile) => {
    setState(prev => ({ ...prev, userProfile: profile }))
  }, [])

  useEffect(() => {
    checkUser()

    // Skip auth state listener if no Supabase client
    if (!supabase) return

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
  }, [checkUser, fetchUserProfile, supabase])

  return {
    ...state,
    signOut,
    updateProfile,
    refetchProfile: () => state.user && fetchUserProfile(state.user.id),
  }
}