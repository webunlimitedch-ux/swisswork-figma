import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { JobListings } from '@/components/sections/job-listings'
import { CompanyShowcase } from '@/components/sections/company-showcase'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <JobListings />
        <CompanyShowcase />
      </main>
    </div>
  )
}