import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { ProfileForm } from '@/components/profile/profile-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default async function ProfilePage() {
  const supabase = createClient()
  
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Profil</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Profil-Informationen
          </p>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <ProfileForm />
        </Suspense>
      </main>
    </div>
  )
}