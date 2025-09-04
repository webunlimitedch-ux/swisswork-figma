import { Header } from '@/components/layout/header'
import { JobListings } from '@/components/sections/job-listings'

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Alle Jobs</h1>
          <p className="text-muted-foreground">
            Durchsuchen Sie alle verfügbaren Stellenausschreibungen
          </p>
        </div>
        <JobListings />
      </main>
    </div>
  )
}