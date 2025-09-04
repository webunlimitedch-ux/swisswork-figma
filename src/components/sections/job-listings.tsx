'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, MapPin, Clock, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatBudget, getTimeAgo } from '@/lib/utils'
import type { ServiceListing } from '@/types'

export function JobListings() {
  const [listings, setListings] = useState<ServiceListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('service_listings')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) throw error
        setListings(data || [])
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Aktuelle Stellenausschreibungen</h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Aktuelle Stellenausschreibungen</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie spannende Projekte von Schweizer Unternehmen und starten Sie noch heute
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{listing.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{listing.category}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <DollarSign size={12} />
                        {formatBudget(listing.budget)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock size={12} />
                        {listing.timeline}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {getTimeAgo(listing.created_at)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="mb-4 line-clamp-3">
                  {listing.description}
                </CardDescription>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin size={14} className="mr-1" />
                    Schweiz
                  </div>
                  
                  <Link href={`/jobs/${listing.id}`}>
                    <Button size="sm">
                      <Eye size={16} className="mr-2" />
                      Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/jobs">
            <Button size="lg" variant="outline">
              Alle Jobs anzeigen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}