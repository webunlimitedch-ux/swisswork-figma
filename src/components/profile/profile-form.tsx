'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, User } from 'lucide-react'
import { useAuthContext } from '@/providers/auth-provider'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { CATEGORIES, type UserProfile } from '@/types'

interface ProfileFormData {
  name: string
  company_name: string
  description: string
  category: string
  website: string
  phone: string
  location: string
}

export function ProfileForm() {
  const { user, userProfile, updateProfile, accessToken } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    company_name: '',
    description: '',
    category: '',
    website: '',
    phone: '',
    location: '',
  })
  const router = useRouter()

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        company_name: userProfile.company_name || '',
        description: userProfile.description || '',
        category: userProfile.category || '',
        website: userProfile.website || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
      })
    }
  }, [userProfile])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !accessToken) return

    setLoading(true)

    try {
      const response = await api.updateProfile(formData, accessToken)
      
      if (response.success && response.data) {
        updateProfile(response.data)
        toast.success('Profil erfolgreich aktualisiert!')
        router.push('/dashboard')
      } else {
        toast.error(response.error || 'Fehler beim Speichern')
      }
    } catch (error: unknown) {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const isCompany = userProfile?.account_type === 'company'

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isCompany ? (
              <>
                <Building2 size={24} className="text-blue-600" />
                Firmenprofil
              </>
            ) : (
              <>
                <User size={24} className="text-green-600" />
                Benutzerprofil
              </>
            )}
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihre Profil-Informationen
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isCompany ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Firmenname *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie eine Kategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Firmenbeschreibung</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Speichern...' : 'Profil speichern'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}