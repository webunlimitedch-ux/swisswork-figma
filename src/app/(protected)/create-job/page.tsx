import { CreateJobForm } from '@/components/jobs/create-job-form'

export default function CreateJobPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Job ausschreiben</h1>
        <p className="text-muted-foreground">
          Erstellen Sie eine neue Stellenausschreibung
        </p>
      </div>
      <CreateJobForm />
    </div>
  )
}