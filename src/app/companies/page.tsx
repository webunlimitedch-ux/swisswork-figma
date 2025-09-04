import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { CompanyShowcase } from '@/components/sections/company-showcase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Alle Dienstleister</h1>
          <p className="text-muted-foreground">
            Entdecken Sie professionelle Dienstleister in der Schweiz
          </p>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <CompanyShowcase />
        </Suspense>
      </main>
    </div>
  )
}