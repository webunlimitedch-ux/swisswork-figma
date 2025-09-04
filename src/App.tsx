import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Header } from './components/layout/Header';
import { AuthForm } from './components/AuthForm';
import { PasswordResetConfirm } from './components/PasswordResetConfirm';
import { CompanyProfile } from './components/CompanyProfile';
import { ServiceListings } from './components/ServiceListings';
import { CreateListing } from './components/CreateListing';
import { EditListing } from './components/EditListing';
import { Dashboard } from './components/Dashboard';
import { ListingDetail } from './components/ListingDetail';
import { BrowseCompanies } from './components/BrowseCompanies';
import { useAuth } from './hooks/useAuth';
import type { ServiceListing } from './types';
import { Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

export default function App() {
  const { user, userProfile, accessToken, loading, signOut, updateProfile } = useAuth();
  const [currentView, setCurrentView] = useState('listings');
  const [selectedListing, setSelectedListing] = useState<ServiceListing | null>(null);
  const [editingListing, setEditingListing] = useState<ServiceListing | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    // Check for password reset URL parameters
    const url = new URL(window.location.href);
    const type = url.searchParams.get('type');
    if (type === 'recovery') {
      setShowPasswordReset(true);
    }
  }, []);

  function handleSignOut() {
    signOut();
    setCurrentView('listings');
    setSelectedListing(null);
    setEditingListing(null);
    setShowPasswordReset(false);
  }

  function handleAuthSuccess() {
    setCurrentView('listings');
  }

  function handleViewListing(listing: ServiceListing) {
    setSelectedListing(listing);
    setCurrentView('listing-detail');
  }

  function handleEditListing(listing: ServiceListing) {
    setEditingListing(listing);
    setCurrentView('edit-listing');
  }

  function handleAuthRequired() {
    // Show auth form when authentication is required
    setCurrentView('auth');
  }

  function handleEditSuccess() {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner 
          size="lg" 
          text="SwissWork wird geladen..."
        />
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header
          user={user}
          userProfile={userProfile}
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            if (view === 'listings') {
              setSelectedListing(null);
              setEditingListing(null);
            }
          }}
          onSignOut={handleSignOut}
        />

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
              accessToken={accessToken!} 
              onSuccess={() => setCurrentView('dashboard')}
            />
          )}
          
          {user && currentView === 'edit-listing' && editingListing && (
            <EditListing 
              listing={editingListing}
              accessToken={accessToken!} 
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          )}
          
          {user && currentView === 'profile' && (
            <CompanyProfile 
              accessToken={accessToken!} 
              userProfile={userProfile}
              onProfileUpdate={updateProfile}
            />
          )}
          
          {user && currentView === 'dashboard' && (
            <Dashboard 
              accessToken={accessToken!} 
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
    </ErrorBoundary>
  );
}