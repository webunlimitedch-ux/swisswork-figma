'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Star, Award, MapPin } from 'lucide-react'

interface MockCompany {
  id: string
  company_name: string
  description: string
  category: string
  location: string
  rating: number
  completed_jobs: number
  created_at: string
}

const MOCK_COMPANIES: MockCompany[] = [
  {
    id: '1',
    company_name: 'WebStudio Zürich',
    description: 'Spezialisiert auf moderne Webentwicklung und E-Commerce-Lösungen für KMU.',
    category: 'Web Design & Entwicklung',
    location: 'Zürich',
    rating: 4.8,
    completed_jobs: 45,
    created_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
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
    company_name: 'MarketingPro Bern',
    description: 'Full-Service Marketing-Agentur für digitale Transformation und Wachstum.',
    category: 'Marketing & Werbung',
    location: 'Bern',
    rating: 4.7,
    completed_jobs: 28,
    created_at: '2023-03-10T00:00:00Z',
  }
]

export function CompanyShowcase() {
  const [companies, setCompanies] = useState<MockCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setCompanies(MOCK_COMPANIES)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Dienstleister</h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Dienstleister</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie die besten Schweizer Unternehmen und Freelancer auf unserer Plattform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-blue-100 p-2 rounded-full shrink-0">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{company.company_name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {company.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {company.description}
                </p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="text-yellow-500" size={14} />
                      </div>
                      <p className="text-sm font-semibold">{company.rating}</p>
                      <p className="text-xs text-muted-foreground">Bewertung</p>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="text-green-500" size={14} />
                      </div>
                      <p className="text-sm font-semibold">{company.completed_jobs}</p>
                      <p className="text-xs text-muted-foreground">Jobs</p>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Building2 className="text-blue-500" size={14} />
                      </div>
                      <p className="text-sm font-semibold">
                        {new Date(company.created_at).getFullYear()}
                      </p>
                      <p className="text-xs text-muted-foreground">Seit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{company.location}</span>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    Profil anzeigen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/companies">
            <Button size="lg" variant="outline">
              Alle Dienstleister anzeigen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}