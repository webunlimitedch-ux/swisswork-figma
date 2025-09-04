import { supabaseAnonKey } from '@/lib/config'
import type { 
  User, 
  UserProfile, 
  ServiceListing, 
  Offer, 
  AuthFormData, 
  CreateListingData, 
  OfferFormData,
  ApiResponse 
} from '@/types'

// Mock data for development/build
const MOCK_LISTINGS: ServiceListing[] = [
  {
    id: '1',
    client_id: 'client1',
    title: 'Website-Design für Restaurant',
    description: 'Wir suchen einen erfahrenen Webdesigner für die Erstellung einer modernen Restaurant-Website mit Online-Reservierungssystem.',
    category: 'Web Design & Entwicklung',
    budget: 5000,
    timeline: '2-4 Wochen',
    status: 'open',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    client_id: 'client2',
    title: 'Logo-Design für Startup',
    description: 'Kreatives Logo-Design für ein innovatives Tech-Startup im Bereich nachhaltiger Mobilität.',
    category: 'Grafikdesign',
    budget: 1500,
    timeline: '1-2 Wochen',
    status: 'open',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    client_id: 'client3',
    title: 'Marketing-Kampagne für E-Commerce',
    description: 'Entwicklung einer umfassenden Digital-Marketing-Strategie für einen Online-Shop.',
    category: 'Marketing & Werbung',
    budget: 8000,
    timeline: '1-2 Monate',
    status: 'open',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
]

const MOCK_COMPANIES: UserProfile[] = [
  {
    id: '1',
    user_id: 'user1',
    email: 'info@webstudio.ch',
    account_type: 'company',
    company_name: 'WebStudio Zürich',
    description: 'Spezialisiert auf moderne Webentwicklung und E-Commerce-Lösungen für KMU.',
    category: 'Web Design & Entwicklung',
    website: 'https://webstudio.ch',
    location: 'Zürich',
    rating: 4.8,
    completed_jobs: 45,
    created_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user2',
    email: 'hello@designhaus.ch',
    account_type: 'company',
    company_name: 'DesignHaus Basel',
    description: 'Kreative Grafikdesign-Agentur mit Fokus auf Branding und Corporate Identity.',
    category: 'Grafikdesign',
    location: 'Basel',
    rating: 4.9,
    completed_jobs: 32,
    created_at: '2022-08-20T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'user3',
    email: 'contact@marketingpro.ch',
    account_type: 'company',
    company_name: 'MarketingPro Bern',
    description: 'Full-Service Marketing-Agentur für digitale Transformation und Wachstum.',
    category: 'Marketing & Werbung',
    location: 'Bern',
    rating: 4.7,
    completed_jobs: 28,
    created_at: '2023-03-10T00:00:00Z',
  }
]

// Base API client
class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private useMockData: boolean

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || ''
    this.useMockData = !baseUrl || baseUrl.includes('placeholder')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Use mock data if Supabase is not configured
    if (this.useMockData) {
      return this.getMockResponse<T>(endpoint)
    }

    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || `HTTP ${response.status}: ${response.statusText}` 
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('API request failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error occurred' 
      }
    }
  }

  private getMockResponse<T>(endpoint: string): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('/listings')) {
          resolve({ success: true, data: MOCK_LISTINGS as T })
        } else if (endpoint.includes('/companies')) {
          resolve({ success: true, data: MOCK_COMPANIES as T })
        } else {
          resolve({ success: false, error: 'Mock endpoint not implemented' })
        }
      }, 500) // Simulate network delay
    })
  }

  // Auth endpoints
  async signUp(userData: AuthFormData): Promise<ApiResponse<User>> {
    if (this.useMockData) {
      return { success: false, error: 'Authentication not available in demo mode' }
    }
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Profile endpoints
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    if (this.useMockData) {
      return { success: false, error: 'Profile not available in demo mode' }
    }
    return this.request(`/profile/${userId}`)
  }

  async updateProfile(profileData: Partial<UserProfile>, accessToken: string): Promise<ApiResponse<UserProfile>> {
    if (this.useMockData) {
      return { success: false, error: 'Profile updates not available in demo mode' }
    }
    return this.request('/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    })
  }

  // Listings endpoints
  async getListings(category?: string): Promise<ApiResponse<ServiceListing[]>> {
    if (this.useMockData) {
      let listings = MOCK_LISTINGS
      if (category && category !== 'all') {
        listings = listings.filter(listing => listing.category === category)
      }
      return Promise.resolve({ success: true, data: listings })
    }

    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    return this.request(`/listings${params}`)
  }

  async getListing(id: string): Promise<ApiResponse<ServiceListing>> {
    if (this.useMockData) {
      const listing = MOCK_LISTINGS.find(l => l.id === id)
      if (listing) {
        return Promise.resolve({ success: true, data: listing })
      }
      return Promise.resolve({ success: false, error: 'Listing not found' })
    }
    return this.request(`/listings/${id}`)
  }

  async createListing(listingData: CreateListingData, accessToken: string): Promise<ApiResponse<ServiceListing>> {
    if (this.useMockData) {
      return { success: false, error: 'Creating listings not available in demo mode' }
    }
    return this.request('/listings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    })
  }

  // Companies endpoints
  async getCompanies(category?: string): Promise<ApiResponse<UserProfile[]>> {
    if (this.useMockData) {
      let companies = MOCK_COMPANIES
      if (category && category !== 'all') {
        companies = companies.filter(company => company.category === category)
      }
      return Promise.resolve({ success: true, data: companies })
    }

    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    return this.request(`/companies${params}`)
  }
}

// Export singleton instance - will use mock data if Supabase not configured
export const api = new ApiClient()