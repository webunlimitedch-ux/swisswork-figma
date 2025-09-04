import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">SwissWork</h1>
          <p className="text-gray-600">Ihr Schweizer Freelance Marktplatz</p>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  )
}