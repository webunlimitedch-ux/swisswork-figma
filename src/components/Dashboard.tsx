import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { LayoutDashboard, Briefcase, MessageSquare, Eye, DollarSign, Clock, Building2, Trash2, Edit3 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Dashboard({ accessToken, user, onViewListing, onEditListing }) {
  const [userListings, setUserListings] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Get user's listings
      const listingsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (listingsResponse.ok) {
        const allListings = await listingsResponse.json();
        const myListings = allListings.filter(listing => listing.clientId === user.id);
        setUserListings(myListings);
        
        // Extract all offers from user's listings
        const offers = myListings.flatMap(listing => 
          (listing.offers || []).map(offer => ({
            ...offer,
            listingTitle: listing.title,
            listingId: listing.id
          }))
        );
        setReceivedOffers(offers);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteListing(listingId) {
    try {
      setDeleteLoading(listingId);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Fehler beim Löschen der Stellenausschreibung');
        return;
      }

      // Refresh dashboard data
      await fetchDashboardData();
      
      // Clear any errors
      setError('');
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Ein Fehler ist beim Löschen aufgetreten');
    } finally {
      setDeleteLoading(null);
    }
  }

  function formatBudget(budget) {
    if (budget >= 1000) {
      return `CHF ${(budget / 1000).toFixed(1)}k`;
    }
    return `CHF ${budget}`;
  }

  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vor weniger als einer Stunde';
    } else if (diffInHours < 24) {
      return `Vor ${diffInHours} Stunde${diffInHours > 1 ? 'n' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Lade Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <LayoutDashboard size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl">Dashboard</h2>
          <p className="text-gray-600">Verwalten Sie Ihre Ausschreibungen und verfolgen Sie Angebote</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
                <p className="text-sm text-gray-600">Aktive Ausschreibungen</p>
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
                <p className="text-sm text-gray-600">Angebote insgesamt</p>
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
                    ? `CHF ${Math.round(receivedOffers.reduce((sum, offer) => sum + parseInt(offer.price), 0) / receivedOffers.length)}`
                    : 'CHF 0'
                  }
                </p>
                <p className="text-sm text-gray-600">Ø Angebotswert</p>
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
                <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg mb-2">Noch keine Stellenausschreibungen</h3>
                <p className="text-gray-600 mb-4">
                  Erstellen Sie Ihre erste Stellenausschreibung, um Angebote von Dienstleistern zu erhalten.
                </p>
                <Button onClick={() => window.location.reload()}>
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
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          {getTimeAgo(listing.createdAt)}
                        </p>
                        {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
                          <p className="text-sm text-gray-500 mb-1">
                            Aktualisiert {getTimeAgo(listing.updatedAt)}
                          </p>
                        )}
                        <Badge variant={listing.status === 'open' ? 'default' : 'secondary'}>
                          {listing.status === 'open' ? 'offen' : listing.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {listing.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {listing.offers?.length || 0} Angebot{(listing.offers?.length || 0) !== 1 ? 'e' : ''}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewListing(listing)}
                        >
                          <Eye size={14} className="mr-2" />
                          Details anzeigen
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditListing(listing)}
                        >
                          <Edit3 size={14} className="mr-2" />
                          Bearbeiten
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={deleteLoading === listing.id}
                            >
                              {deleteLoading === listing.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              ) : (
                                <Trash2 size={14} className="mr-2" />
                              )}
                              Löschen
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Stellenausschreibung löschen</AlertDialogTitle>
                              <AlertDialogDescription>
                                Sind Sie sicher, dass Sie diese Stellenausschreibung löschen möchten? 
                                Diese Aktion kann nicht rückgängig gemacht werden und alle zugehörigen 
                                Angebote gehen verloren.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteListing(listing.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Ja, löschen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg mb-2">Noch keine Angebote</h3>
                <p className="text-gray-600">
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
                          Angebot für: {offer.listingTitle}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 size={16} className="text-gray-500" />
                          <span className="font-medium">{offer.companyName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600 mb-1">
                          CHF {offer.price}
                        </p>
                        <p className="text-sm text-gray-500">{offer.timeline}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-4">{offer.proposal}</p>
                    
                    {offer.examples && offer.examples.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Portfolio-Beispiele:</p>
                        <div className="space-y-1">
                          {offer.examples.map((example, i) => (
                            <a 
                              key={i} 
                              href={example} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm block"
                            >
                              {example}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Erhalten {getTimeAgo(offer.createdAt)}
                      </p>
                      
                      <Button 
                        onClick={() => {
                          const listing = userListings.find(l => l.id === offer.listingId);
                          if (listing) onViewListing(listing);
                        }}
                        size="sm"
                      >
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
  );
}