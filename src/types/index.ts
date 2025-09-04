export interface User {
  id: string
  email: string
  created_at: string
  user_metadata: {
    name: string
    account_type: 'individual' | 'company'
  }
}

export interface UserProfile {
  id: string
  user_id: string
  email: string
  account_type: 'individual' | 'company'
  name?: string
  company_name?: string
  description?: string
  category?: string
  website?: string
  phone?: string
  location?: string
  rating?: number
  completed_jobs?: number
  created_at: string
  updated_at?: string
}

export interface ServiceListing {
  id: string
  client_id: string
  title: string
  description: string
  category: string
  budget: number
  timeline: string
  status: 'open' | 'closed' | 'in_progress'
  offers: Offer[]
  created_at: string
  updated_at?: string
}

export interface Offer {
  id: string
  company_id: string
  company_name: string
  listing_id: string
  proposal: string
  price: number
  timeline: string
  examples: string[]
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
  name: string
  accountType: 'individual' | 'company'
}

export interface CreateListingData {
  title: string
  description: string
  category: string
  budget: string
  timeline: string
}

export interface OfferFormData {
  proposal: string
  price: string
  timeline: string
  examples: string
}

export const CATEGORIES = [
  'Web Design & Entwicklung',
  'Grafikdesign',
  'Marketing & Werbung',
  'Content-Erstellung',
  'Fotografie',
  'Videoproduktion',
  'Beratung',
  'Übersetzung',
  'Rechtsdienstleistungen',
  'Buchhaltung',
  'Andere'
] as const

export type Category = typeof CATEGORIES[number]

export const BUDGET_RANGES = [
  { label: 'Unter CHF 1.000', value: 1000 },
  { label: 'CHF 1.000 - 5.000', value: 5000 },
  { label: 'CHF 5.000 - 10.000', value: 10000 },
  { label: 'CHF 10.000 - 25.000', value: 25000 },
  { label: 'CHF 25.000+', value: 50000 },
] as const

export const TIMELINE_OPTIONS = [
  '1-2 Wochen',
  '2-4 Wochen',
  '1-2 Monate',
  '2-3 Monate',
  '3+ Monate',
  'Laufend'
] as const

export type Timeline = typeof TIMELINE_OPTIONS[number]