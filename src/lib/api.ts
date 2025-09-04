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

const API_BASE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/server`

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        return { success: false, error: errorText || 'Request failed' }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('API request failed:', error)
      return { success: false, error: 'Network error occurred' }
    }
  }

  // Auth endpoints
  async signUp(userData: AuthFormData): Promise<ApiResponse<User>> {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Profile endpoints
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return this.request(`/profile/${userId}`)
  }

  async updateProfile(profileData: Partial<UserProfile>, accessToken: string): Promise<ApiResponse<UserProfile>> {
    return this.request('/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    })
  }

  async convertToCompany(companyName: string, accessToken: string): Promise<ApiResponse<UserProfile>> {
    return this.request('/convert-to-company', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ companyName }),
    })
  }

  // Listings endpoints
  async getListings(category?: string): Promise<ApiResponse<ServiceListing[]>> {
    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    return this.request(`/listings${params}`)
  }

  async getListing(id: string): Promise<ApiResponse<ServiceListing>> {
    return this.request(`/listings/${id}`)
  }

  async createListing(listingData: CreateListingData, accessToken: string): Promise<ApiResponse<ServiceListing>> {
    return this.request('/listings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    })
  }

  async updateListing(id: string, listingData: Partial<CreateListingData>, accessToken: string): Promise<ApiResponse<ServiceListing>> {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    })
  }

  async deleteListing(id: string, accessToken: string): Promise<ApiResponse<void>> {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  // Offers endpoints
  async submitOffer(offerData: OfferFormData & { listingId: string }, accessToken: string): Promise<ApiResponse<Offer>> {
    return this.request('/offers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...offerData,
        examples: offerData.examples.split('\n').filter(line => line.trim())
      }),
    })
  }

  // Companies endpoints
  async getCompanies(category?: string): Promise<ApiResponse<UserProfile[]>> {
    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    return this.request(`/companies${params}`)
  }
}

export const api = new ApiClient()