'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutDashboard, Briefcase, MessageSquare, DollarSign, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { api } from '@/lib/api'
import { useAuthContext } from '@/providers/auth-provider'
import { formatBudget, getTimeAgo } from '@/lib/utils'
import type { ServiceListing, Offer } from '@/types'

export function Dashboard() {
  const { user, userProfile } = useAuthContext()
  const [userListings, setUserListings] = useState<ServiceListing[]>([])
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      
      // Get all listings and filter for current user
      const allListings = await api.getListings()
      const userListings = allListings.filter(listing => listing.client_id === user?.id)
      
      setUserListings(userListings)
      
      // Extract all offers from user's listings
      const offers = userListings?.flatMap(listing => 
        listing.offers?.map(offer => ({
          ...offer,
          listing_title: listing.title,
          listing_id: listing.id
        })) || []
      ) || []
      
      setReceivedOffers(offers)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Lade Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <LayoutDashboard size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Ausschreibungen und verfolgen Sie Angebote
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Briefcase size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{userListings.length}</p>
                <p className="text-sm text-muted-foreground">Aktive Ausschreibungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <MessageSquare size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{receivedOffers.length}</p>
                <p className="text-sm text-muted-foreground">Angebote insgesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <DollarSign size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {receivedOffers.length > 0 
                    ? `CHF ${Math.round(receivedOffers.reduce((sum, offer) => sum + offer.price, 0) / receivedOffers.length)}`
                    : 'CHF 0'
                  }
                </p>
                <p className="text-sm text-muted-foreground">Ø Angebotswert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList>
          <TabsTrigger value="listings">Meine Stellenausschreibungen</TabsTrigger>
          <TabsTrigger value="offers">Erhaltene Angebote</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings" className="space-y-4">
          {userListings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Noch keine Stellenausschreibungen</h3>
                <p className="text-muted-foreground mb-4">
                  Erstellen Sie Ihre erste Stellenausschreibung, um Angebote von Dienstleistern zu erhalten.
                </p>
                <Button>
                  <Plus className="mr-2" size={16} />
                  Ersten Job ausschreiben
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userListings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{listing.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">{listing.category}</Badge>
                          <Badge variant="outline">
                            {formatBudget(listing.budget)}
                          </Badge>
                          <Badge variant="outline">{listing.timeline}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                          {getTimeAgo(listing.created_at)}
                        </p>
                        <Badge variant={listing.status === 'open' ? 'default' : 'secondary'}>
                          {listing.status === 'open' ? 'offen' : listing.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {listing.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {listing.offers?.length || 0} Angebot{(listing.offers?.length || 0) !== 1 ? 'e' : ''}
                      </p>
                      
                      <Button variant="outline" size="sm">
                        Details anzeigen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="offers" className="space-y-4">
          {receivedOffers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Noch keine Angebote</h3>
                <p className="text-muted-foreground">
                  Sobald Sie Stellenausschreibungen veröffentlichen, können Dienstleister hier Angebote abgeben.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {receivedOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          Angebot für: {offer.listing_title}
                        </CardTitle>
                        <p className="font-medium">{offer.company_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600 mb-1">
                          CHF {offer.price}
                        </p>
                        <p className="text-sm text-muted-foreground">{offer.timeline}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{offer.proposal}</p>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Erhalten {getTimeAgo(offer.created_at)}
                      </p>
                      
                      <Button size="sm">
                        Vollständige Ausschreibung anzeigen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}