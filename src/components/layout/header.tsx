'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2, Search, Plus } from 'lucide-react'

export function Header() {
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
              <Link href="/auth">
                <Button variant="ghost">
                  <Plus className="mr-2" size={16} />
                  Job ausschreiben
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="outline">Anmelden</Button>
            </Link>
            <Link href="/auth">
              <Button>Registrieren</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}