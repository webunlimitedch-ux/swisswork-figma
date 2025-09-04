import type { 
  User, 
  UserProfile, 
  ServiceListing, 
  Offer, 
  AuthFormData, 
  CreateListingData, 
  OfferFormData,
  ApiResponse 
} from '../types';
import { API_BASE_URL, publicAnonKey } from './config';

// Base API client
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error occurred' };
    }
  }

  // Auth endpoints
  async signUp(userData: AuthFormData): Promise<ApiResponse<User>> {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Profile endpoints
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return this.request(`/profile/${userId}`);
  }

  async updateProfile(profileData: Partial<UserProfile>, accessToken: string): Promise<ApiResponse<UserProfile>> {
    return this.request('/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    });
  }

  async convertToCompany(companyName: string, accessToken: string): Promise<ApiResponse<UserProfile>> {
    return this.request('/convert-to-company', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ companyName }),
    });
  }

  // Listings endpoints
  async getListings(category?: string): Promise<ApiResponse<ServiceListing[]>> {
    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/listings${params}`);
  }

  async getListing(id: string): Promise<ApiResponse<ServiceListing>> {
    return this.request(`/listings/${id}`);
  }

  async createListing(listingData: CreateListingData, accessToken: string): Promise<ApiResponse<ServiceListing>> {
    return this.request('/listings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    });
  }

  async updateListing(id: string, listingData: Partial<CreateListingData>, accessToken: string): Promise<ApiResponse<ServiceListing>> {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    });
  }

  async deleteListing(id: string, accessToken: string): Promise<ApiResponse<void>> {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
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
    });
  }

  // Companies endpoints
  async getCompanies(category?: string): Promise<ApiResponse<UserProfile[]>> {
    const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/companies${params}`);
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);