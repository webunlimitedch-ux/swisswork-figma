import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { JobListings } from '@/components/sections/job-listings'
import { CompanyShowcase } from '@/components/sections/company-showcase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingSpinner />}>
          <JobListings />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <CompanyShowcase />
        </Suspense>
      </main>
    </div>
  )
}