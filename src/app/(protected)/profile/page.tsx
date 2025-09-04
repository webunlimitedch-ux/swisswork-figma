import { ProfileForm } from '@/components/profile/profile-form'

export default function ProfilePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Profil</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Profil-Informationen
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}