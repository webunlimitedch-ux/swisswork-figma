'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Building2, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import type { AuthFormData } from '@/types'

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    accountType: 'individual'
  })
  
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      toast.success('Erfolgreich angemeldet!')
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwörter stimmen nicht überein')
      setLoading(false)
      return
    }

    try {
      const response = await api.signUp(formData)

      if (response.success) {
        toast.success('Konto erfolgreich erstellt!')
        router.push('/dashboard')
      } else {
        toast.error(response.error || 'Registrierung fehlgeschlagen')
      }
    } catch (error: unknown) {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Willkommen bei SwissWork</CardTitle>
        <CardDescription>
          Melden Sie sich an oder erstellen Sie ein neues Konto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Anmelden</TabsTrigger>
            <TabsTrigger value="signup">Registrieren</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">E-Mail</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Passwort</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Anmelden...' : 'Anmelden'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-3">
                <Label>Kontotyp</Label>
                <RadioGroup
                  value={formData.accountType}
                  onValueChange={(value: 'individual' | 'company') => handleInputChange('accountType', value)}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-3">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <User size={20} className="text-blue-600" />
                      <div>
                        <div className="font-medium">Privatperson</div>
                        <div className="text-sm text-muted-foreground">Jobs ausschreiben</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 border rounded-lg p-3">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <Building2 size={20} className="text-green-600" />
                      <div>
                        <div className="font-medium">Unternehmen</div>
                        <div className="text-sm text-muted-foreground">Jobs ausschreiben und Angebote abgeben</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-name">
                  {formData.accountType === 'company' ? 'Firmenname' : 'Name'}
                </Label>
                <Input
                  id="signup-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">E-Mail</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Passwort</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword || ''}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registrieren...' : 'Konto erstellen'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}