import { projectId, publicAnonKey } from './config'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Base API client
class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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
        return { success: false, error: data.error || 'An error occurred' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('API request failed:', error)
      return { success: false, error: 'Network error occurred' }
    }
  }

  // Auth endpoints
  async signUp(userData: any): Promise<ApiResponse<any>> {
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

  // Companies endpoints
  async getCompanies(category?: string): Promise<any[]> {
    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    const response = await this.request(`/companies${params}`)
    return response.data || []
  }
}

// Export singleton instance
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a`
export const api = new ApiClient(API_BASE_URL)