import { AuthForm } from '@/components/auth/auth-form'
import { Building2 } from 'lucide-react'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 size={40} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-900">SwissWork</h1>
          </div>
          <p className="text-gray-600">Ihr Schweizer Freelance Marktplatz</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}