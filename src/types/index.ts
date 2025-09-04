// Core Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name: string;
    accountType: 'individual' | 'company';
  };
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  accountType: 'individual' | 'company';
  name?: string;
  companyName?: string;
  description?: string;
  category?: string;
  website?: string;
  phone?: string;
  location?: string;
  rating?: number;
  completedJobs?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceListing {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  timeline: string;
  status: 'open' | 'closed' | 'in_progress';
  offers: Offer[];
  createdAt: string;
  updatedAt?: string;
}

export interface Offer {
  id: string;
  companyId: string;
  companyName: string;
  listingId: string;
  proposal: string;
  price: number;
  timeline: string;
  examples: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  accountType: 'individual' | 'company';
}

export interface CreateListingData {
  title: string;
  description: string;
  category: string;
  budget: string;
  timeline: string;
}

export interface OfferFormData {
  proposal: string;
  price: string;
  timeline: string;
  examples: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface AuthFormProps {
  onAuthSuccess: (user: User, token: string) => void;
}

export interface ServiceListingsProps {
  accessToken: string | null;
  onViewListing: (listing: ServiceListing) => void;
  onAuthRequired: () => void;
}

export interface ListingDetailProps {
  listing: ServiceListing;
  accessToken: string | null;
  userProfile: UserProfile | null;
  onBack: () => void;
  onAuthRequired: () => void;
  onEdit: (listing: ServiceListing) => void;
  onNavigateToProfile: () => void;
}

export interface DashboardProps {
  accessToken: string;
  user: User;
  onViewListing: (listing: ServiceListing) => void;
  onEditListing: (listing: ServiceListing) => void;
}

export interface CompanyProfileProps {
  accessToken: string;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

export interface CreateListingProps {
  accessToken: string;
  onSuccess: () => void;
}

export interface EditListingProps {
  listing: ServiceListing;
  accessToken: string;
  onSuccess: (listing: ServiceListing) => void;
  onCancel: () => void;
}

export interface BrowseCompaniesProps {
  accessToken: string | null;
  onAuthRequired: () => void;
}

// Constants
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
] as const;

export type Category = typeof CATEGORIES[number];

export const BUDGET_RANGES = [
  { label: 'Unter CHF 1.000', value: 1000 },
  { label: 'CHF 1.000 - 5.000', value: 5000 },
  { label: 'CHF 5.000 - 10.000', value: 10000 },
  { label: 'CHF 10.000 - 25.000', value: 25000 },
  { label: 'CHF 25.000+', value: 50000 },
] as const;

export const TIMELINE_OPTIONS = [
  '1-2 Wochen',
  '2-4 Wochen',
  '1-2 Monate',
  '2-3 Monate',
  '3+ Monate',
  'Laufend'
] as const;

export type Timeline = typeof TIMELINE_OPTIONS[number];