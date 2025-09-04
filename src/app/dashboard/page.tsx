import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Header } from '@/components/layout/header'
import { Dashboard } from '@/components/dashboard/dashboard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      </main>
    </div>
  )
}