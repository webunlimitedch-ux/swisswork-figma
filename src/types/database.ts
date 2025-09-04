export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id?: string
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          account_type?: 'individual' | 'company'
          name?: string
          company_name?: string
          description?: string
          category?: string
          website?: string
          phone?: string
          location?: string
          rating?: number
          completed_jobs?: number
          created_at?: string
          updated_at?: string
        }
      }
      service_listings: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string
          category: string
          budget: number
          timeline: string
          status: 'open' | 'closed' | 'in_progress'
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description: string
          category: string
          budget: number
          timeline: string
          status?: 'open' | 'closed' | 'in_progress'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string
          category?: string
          budget?: number
          timeline?: string
          status?: 'open' | 'closed' | 'in_progress'
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
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
        Insert: {
          id?: string
          company_id: string
          company_name: string
          listing_id: string
          proposal: string
          price: number
          timeline: string
          examples?: string[]
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          company_name?: string
          listing_id?: string
          proposal?: string
          price?: number
          timeline?: string
          examples?: string[]
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}