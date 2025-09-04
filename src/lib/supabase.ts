import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './config';

// Create a singleton Supabase client instance
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Type-safe auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getSession: async () => {
    return await supabase.auth.getSession();
  },
  
  getUser: async (token?: string) => {
    if (token) {
      return await supabase.auth.getUser(token);
    }
    return await supabase.auth.getUser();
  },
  
  resetPassword: async (email: string, redirectTo?: string) => {
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  },
  
  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password });
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};