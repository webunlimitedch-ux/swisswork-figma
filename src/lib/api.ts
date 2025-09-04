import { supabase } from './supabase'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

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
  async signUp(userData: {
    email: string
    password: string
    name: string
    accountType: 'individual' | 'company'
  }): Promise<ApiResponse<any>> {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Profile endpoints
  async getProfile(userId: string): Promise<any> {
    const response = await this.request(`/profile/${userId}`)
    return response.data
  }

  async updateProfile(profileData: any, accessToken: string): Promise<ApiResponse<any>> {
    return this.request('/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    })
  }

  // Listings endpoints
  async getListings(category?: string): Promise<any[]> {
    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    const response = await this.request(`/listings${params}`)
    return response.data || []
  }

  async getListing(id: string): Promise<any> {
    const response = await this.request(`/listings/${id}`)
    return response.data
  }

  async createListing(listingData: any, accessToken: string): Promise<ApiResponse<any>> {
    return this.request('/listings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    })
  }

  async updateListing(id: string, listingData: any, accessToken: string): Promise<ApiResponse<any>> {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    })
  }

  async deleteListing(id: string, accessToken: string): Promise<ApiResponse<any>> {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  // Companies endpoints
  async getCompanies(category?: string): Promise<any[]> {
    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    const response = await this.request(`/companies${params}`)
    return response.data || []
  }

  // Offers endpoints
  async createOffer(offerData: any, accessToken: string): Promise<ApiResponse<any>> {
    return this.request('/offers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(offerData),
    })
  }
}

export const api = new ApiClient()