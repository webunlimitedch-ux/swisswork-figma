'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Building2, LogOut, User, Plus, Search } from 'lucide-react'
import { useAuthContext } from '@/providers/auth-provider'

export function Header() {
  const { user, userProfile, signOut } = useAuthContext()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-900">SwissWork</h1>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/jobs">
                <Button variant="ghost">
                  <Search className="mr-2" size={16} />
                  Jobs durchsuchen
                </Button>
              </Link>
              <Link href="/companies">
                <Button variant="ghost">
                  <Building2 className="mr-2" size={16} />
                  Unternehmen
                </Button>
              </Link>
              {user && (
                <Link href="/create-job">
                  <Button variant="ghost">
                    <Plus className="mr-2" size={16} />
                    Job ausschreiben
                  </Button>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User size={16} />
                    <span className="hidden sm:inline">
                      {userProfile?.account_type === 'company' 
                        ? userProfile?.company_name 
                        : userProfile?.name || user.email
                      }
                    </span>
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline">Anmelden</Button>
                </Link>
                <Link href="/auth">
                  <Button>Job ausschreiben</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}