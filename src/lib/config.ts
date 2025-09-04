// Environment configuration
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "hsibsfxqhjjluiejpszr";
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzaWJzZnhxaGpqbHVpZWpwc3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODc4NjIsImV4cCI6MjA3MjU2Mzg2Mn0.7lact5_jvtX9BSbQoayD9wyDydikMcfhtspnbiIcQTM";

export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a`;

// App configuration
export const APP_CONFIG = {
  name: 'SwissWork',
  description: 'Der Schweizer Marktplatz für professionelle Dienstleistungen',
  version: '1.0.0',
  author: 'SwissWork Team',
  url: typeof window !== 'undefined' ? window.location.origin : '',
} as const;

// Feature flags
export const FEATURES = {
  enablePasswordReset: true,
  enableCompanyProfiles: true,
  enableOfferSystem: true,
  enableRatings: false, // Future feature
  enablePayments: false, // Future feature
} as const;