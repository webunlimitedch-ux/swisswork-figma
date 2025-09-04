import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search, MapPin, Clock, DollarSign, Eye } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const categories = [
  'all',
  'Web Design & Entwicklung',
  'Grafikdesign',
  'Marketing & Werbung',
  'Content-Erstellung',
  'Fotografie',
  'Videoproduktion',
  'Beratung',
  'Übersetzung',
  'Rechtsdienstleistungen',
  'Buchhaltung',
  'Andere'
];

export function ServiceListings({ accessToken, onViewListing, onAuthRequired }) {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm]);

  async function fetchListings() {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings`
        : `https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings?category=${encodeURIComponent(selectedCategory)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setListings(data);
      } else {
        console.error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterListings() {
    let filtered = listings;
    
    if (searchTerm) {
      filtered = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredListings(filtered);
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
        <p>Lade Stellenausschreibungen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!accessToken && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="text-center py-6">
            <h3 className="text-lg mb-2 text-blue-900">Bereit, Ihr nächstes Projekt zu starten?</h3>
            <p className="text-gray-600 mb-4">
              Melden Sie sich an, um Angebote für diese Jobs abzugeben oder Ihre eigenen Stellenausschreibungen zu veröffentlichen.
            </p>
            <Button onClick={onAuthRequired} className="bg-blue-600 hover:bg-blue-700">
              Kostenlos registrieren
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Verfügbare Jobs</h2>
          <p className="text-gray-600">
            Durchsuchen Sie Stellenausschreibungen von Schweizer Unternehmen, die professionelle Dienstleistungen suchen
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Jobs suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Alle Kategorien" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'Alle Kategorien' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'Keine Jobs gefunden, die Ihrer Suche entsprechen.' : 'Keine Stellenausschreibungen in dieser Kategorie verfügbar.'}
            </p>
            {searchTerm && (
              <Button 
                variant="ghost" 
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                Suche löschen
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{listing.title}</CardTitle>
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
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-2">
                      {getTimeAgo(listing.createdAt)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {listing.offers?.length || 0} Angebot{(listing.offers?.length || 0) !== 1 ? 'e' : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="mb-4 line-clamp-3">
                  {listing.description}
                </CardDescription>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    Schweiz
                  </div>
                  
                  <Button onClick={() => onViewListing(listing)}>
                    <Eye size={16} className="mr-2" />
                    Details anzeigen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}