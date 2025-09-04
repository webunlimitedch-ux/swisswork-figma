import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Building2, LogOut, User, Plus, Search } from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { supabase } from './utils/supabase/client';
import { AuthForm } from './components/AuthForm';
import { PasswordResetConfirm } from './components/PasswordResetConfirm';
import { CompanyProfile } from './components/CompanyProfile';
import { ServiceListings } from './components/ServiceListings';
import { CreateListing } from './components/CreateListing';
import { EditListing } from './components/EditListing';
import { Dashboard } from './components/Dashboard';
import { ListingDetail } from './components/ListingDetail';
import { BrowseCompanies } from './components/BrowseCompanies';

export default function App() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('listings');
  const [selectedListing, setSelectedListing] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    checkUser();
    
    // Check for password reset URL parameters
    const url = new URL(window.location.href);
    const type = url.searchParams.get('type');
    if (type === 'recovery') {
      setShowPasswordReset(true);
    }
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setAccessToken(null);
        setUserProfile(null);
        setCurrentView('listings');
        setShowPasswordReset(false);
      } else if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        fetchUserProfile(session.user.id);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserProfile(userId) {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setUserProfile(null);
      setCurrentView('listings');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  function handleAuthSuccess(userData, token) {
    setUser(userData);
    setAccessToken(token);
    fetchUserProfile(userData.id);
  }

  function handleViewListing(listing) {
    setSelectedListing(listing);
    setCurrentView('listing-detail');
  }

  function handleEditListing(listing) {
    setEditingListing(listing);
    setCurrentView('edit-listing');
  }

  function handleAuthRequired() {
    // Show auth form when authentication is required
    setCurrentView('auth');
  }

  function handleEditSuccess(updatedListing) {
    // Update the listing in state and navigate back to dashboard
    setEditingListing(null);
    setCurrentView('dashboard');
  }

  function handleEditCancel() {
    setEditingListing(null);
    setCurrentView('dashboard');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Lädt...</p>
        </div>
      </div>
    );
  }

  // Show auth form when specifically requested
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-4 text-blue-900">
              <Building2 className="inline-block mr-2 mb-1" size={40} />
              SwissWork
            </h1>
            <p className="text-xl text-gray-600">
              Der Schweizer Marktplatz für professionelle Dienstleistungen
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Bei SwissWork anmelden</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthForm onAuthSuccess={handleAuthSuccess} />
                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('listings')}
                    className="text-sm"
                  >
                    ← Zurück zum Durchsuchen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show password reset form when user clicks reset link from email
  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-4 text-blue-900">
              <Building2 className="inline-block mr-2 mb-1" size={40} />
              SwissWork
            </h1>
            <p className="text-xl text-gray-600">
              Der Schweizer Marktplatz für professionelle Dienstleistungen
            </p>
          </div>
          
          <PasswordResetConfirm 
            onSuccess={() => {
              setShowPasswordReset(false);
              setCurrentView('auth');
              // Clear URL parameters
              window.history.replaceState({}, document.title, window.location.pathname);
            }}
            onError={(error) => {
              console.error('Password reset error:', error);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl text-blue-900 cursor-pointer" onClick={() => {
                setCurrentView('listings');
                setSelectedListing(null);
                setEditingListing(null);
              }}>
                <Building2 className="inline-block mr-2 mb-1" size={28} />
                SwissWork
              </h1>
              
              <nav className="hidden md:flex space-x-6">
                <Button 
                  variant={currentView === 'listings' ? 'default' : 'ghost'}
                  onClick={() => {
                    setCurrentView('listings');
                    setSelectedListing(null);
                    setEditingListing(null);
                  }}
                >
                  <Search className="mr-2" size={16} />
                  Jobs durchsuchen
                </Button>
                <Button 
                  variant={currentView === 'companies' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('companies')}
                >
                  <Building2 className="mr-2" size={16} />
                  Unternehmen durchsuchen
                </Button>
                {user && (
                  <Button 
                    variant={currentView === 'create-listing' ? 'default' : 'ghost'}
                    onClick={() => setCurrentView('create-listing')}
                  >
                    <Plus className="mr-2" size={16} />
                    Job ausschreiben
                  </Button>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('profile')}
                    className="flex items-center space-x-2"
                  >
                    <User size={16} />
                    <span className="hidden sm:inline">
                      {userProfile?.accountType === 'company' ? userProfile?.companyName : userProfile?.name || user.email}
                    </span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('dashboard')}
                  >
                    Dashboard
                  </Button>
                  
                  <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView('auth')}
                  >
                    Anmelden
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('auth')}
                  >
                    Job ausschreiben
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'listings' && (
          <ServiceListings 
            accessToken={accessToken} 
            onViewListing={handleViewListing}
            onAuthRequired={handleAuthRequired}
          />
        )}
        
        {currentView === 'companies' && (
          <BrowseCompanies 
            accessToken={accessToken} 
            onAuthRequired={handleAuthRequired}
          />
        )}
        
        {user && currentView === 'create-listing' && (
          <CreateListing 
            accessToken={accessToken} 
            onSuccess={() => setCurrentView('dashboard')}
          />
        )}
        
        {user && currentView === 'edit-listing' && editingListing && (
          <EditListing 
            listing={editingListing}
            accessToken={accessToken} 
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        )}
        
        {user && currentView === 'profile' && (
          <CompanyProfile 
            accessToken={accessToken} 
            userProfile={userProfile}
            onProfileUpdate={setUserProfile}
          />
        )}
        
        {user && currentView === 'dashboard' && (
          <Dashboard 
            accessToken={accessToken} 
            user={user}
            onViewListing={handleViewListing}
            onEditListing={handleEditListing}
          />
        )}
        
        {currentView === 'listing-detail' && selectedListing && (
          <ListingDetail 
            listing={selectedListing}
            accessToken={accessToken}
            userProfile={userProfile}
            onBack={() => {
              setCurrentView('listings');
              setSelectedListing(null);
            }}
            onAuthRequired={handleAuthRequired}
            onEdit={handleEditListing}
            onNavigateToProfile={() => setCurrentView('profile')}
          />
        )}
      </main>
    </div>
  );
}