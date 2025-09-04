import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search, Building2, Star, Award, MapPin, Globe, Phone } from 'lucide-react';
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

export function BrowseCompanies({ accessToken, onAuthRequired }) {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [selectedCategory]);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/companies`
        : `https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/companies?category=${encodeURIComponent(selectedCategory)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      } else {
        console.error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterCompanies() {
    let filtered = companies;
    
    if (searchTerm) {
      filtered = companies.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCompanies(filtered);
  }

  function getJoinedYear(dateString) {
    return new Date(dateString).getFullYear();
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Lade Unternehmen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Dienstleister durchsuchen</h2>
          <p className="text-gray-600">
            Entdecken Sie professionelle Dienstleister in der Schweiz
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Unternehmen suchen..."
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

      {filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'Keine Unternehmen gefunden, die Ihrer Suche entsprechen.' : 'Keine Unternehmen in dieser Kategorie verfügbar.'}
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-blue-100 p-2 rounded-full shrink-0">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{company.companyName}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {company.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="mb-4 line-clamp-3">
                  {company.description}
                </CardDescription>
                
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="text-yellow-500" size={14} />
                      </div>
                      <p className="text-sm font-semibold">{company.rating || '0.0'}</p>
                      <p className="text-xs text-gray-600">Bewertung</p>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="text-green-500" size={14} />
                      </div>
                      <p className="text-sm font-semibold">{company.completedJobs || 0}</p>
                      <p className="text-xs text-gray-600">Jobs</p>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Building2 className="text-blue-500" size={14} />
                      </div>
                      <p className="text-sm font-semibold">{getJoinedYear(company.createdAt)}</p>
                      <p className="text-xs text-gray-600">Seit</p>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} />
                      <span>{company.location || 'Schweiz'}</span>
                    </div>
                    
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-600" />
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    {company.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} />
                        <span>{company.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (!accessToken) {
                          onAuthRequired();
                          return;
                        }
                        if (company.email) {
                          window.location.href = `mailto:${company.email}?subject=Projektanfrage - SwissWork`;
                        }
                      }}
                    >
                      Unternehmen kontaktieren
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}