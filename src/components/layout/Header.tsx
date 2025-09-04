import React from 'react';
import { Button } from '../ui/button';
import { Building2, LogOut, User, Plus, Search } from 'lucide-react';
import type { User as UserType, UserProfile } from '../../types';

interface HeaderProps {
  user: UserType | null;
  userProfile: UserProfile | null;
  currentView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
}

export function Header({ user, userProfile, currentView, onViewChange, onSignOut }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-2xl text-blue-900 cursor-pointer" 
              onClick={() => onViewChange('listings')}
            >
              <Building2 className="inline-block mr-2 mb-1" size={28} />
              SwissWork
            </h1>
            
            <nav className="hidden md:flex space-x-6">
              <Button 
                variant={currentView === 'listings' ? 'default' : 'ghost'}
                onClick={() => onViewChange('listings')}
              >
                <Search className="mr-2" size={16} />
                Jobs durchsuchen
              </Button>
              <Button 
                variant={currentView === 'companies' ? 'default' : 'ghost'}
                onClick={() => onViewChange('companies')}
              >
                <Building2 className="mr-2" size={16} />
                Unternehmen durchsuchen
              </Button>
              {user && (
                <Button 
                  variant={currentView === 'create-listing' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('create-listing')}
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
                  onClick={() => onViewChange('profile')}
                  className="flex items-center space-x-2"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">
                    {userProfile?.accountType === 'company' 
                      ? userProfile?.companyName 
                      : userProfile?.name || user.email
                    }
                  </span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => onViewChange('dashboard')}
                >
                  Dashboard
                </Button>
                
                <Button variant="ghost" onClick={onSignOut}>
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => onViewChange('auth')}
                >
                  Anmelden
                </Button>
                <Button 
                  onClick={() => onViewChange('auth')}
                >
                  Job ausschreiben
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}