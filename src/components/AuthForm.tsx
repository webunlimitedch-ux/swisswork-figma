import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Building2, User, ArrowLeft, Mail } from 'lucide-react';
import { auth } from '../lib/supabase';
import { api } from '../lib/api';
import { validateAuthForm } from '../utils/validation';
import type { AuthFormData, AuthFormProps } from '../types';

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    accountType: 'individual' // 'individual' or 'company'
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form data
    const validationErrors = validateAuthForm(formData, isLogin);
    if (validationErrors.length > 0) {
      setError(validationErrors[0].message);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const { data: { session }, error } = await auth.signIn(formData.email, formData.password);

        if (error) {
          setError('Anmeldung fehlgeschlagen: ' + error.message);
          setLoading(false);
          return;
        }

        if (session?.user && session?.access_token) {
          onAuthSuccess();
        }
      } else {
        // Register
        const response = await api.signUp(formData);

        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }

        // Auto-login after successful registration
        const { data: { session }, error: loginError } = await auth.signIn(formData.email, formData.password);

        if (loginError) {
          setError('Automatische Anmeldung fehlgeschlagen: ' + loginError.message);
          setLoading(false);
          return;
        }

        if (session?.user && session?.access_token) {
          onAuthSuccess();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setResetLoading(true);
    setError('');

    try {
      const { error } = await auth.resetPassword(
        passwordResetEmail, 
        `${window.location.origin}?type=recovery`
      );

      if (error) {
        setError('Passwort-Reset fehlgeschlagen: ' + error.message);
        setResetLoading(false);
        return;
      }

      setPasswordResetSent(true);
      setResetLoading(false);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setResetLoading(false);
    }
  }

  function handleInputChange(field: keyof AuthFormData, value: string) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  }

  // Password Reset View
  if (showPasswordReset) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => {
              setShowPasswordReset(false);
              setPasswordResetSent(false);
              setPasswordResetEmail('');
              setError('');
            }}
          >
            <ArrowLeft size={16} className="mr-1" />
            Zurück zur Anmeldung
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              Passwort zurücksetzen
            </CardTitle>
            <CardDescription>
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!passwordResetSent ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handlePasswordReset();
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-reset-email">E-Mail-Adresse</Label>
                  <Input
                    id="password-reset-email"
                    type="email"
                    placeholder="ihre@email.ch"
                    value={passwordResetEmail}
                    onChange={(e) => setPasswordResetEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  disabled={resetLoading}
                  className="w-full"
                >
                  {resetLoading ? 'Sende E-Mail...' : 'Passwort-Reset-E-Mail senden'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail size={24} className="text-green-600" />
                </div>
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    <strong>E-Mail gesendet!</strong><br />
                    Wir haben einen Passwort-Reset-Link an <strong>{passwordResetEmail}</strong> gesendet. 
                    Klicken Sie auf den Link in der E-Mail, um Ihr Passwort zu ändern.
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-gray-600">
                  Keine E-Mail erhalten? Überprüfen Sie Ihren Spam-Ordner oder versuchen Sie es erneut.
                </p>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setPasswordResetSent(false);
                    setPasswordResetEmail('');
                  }}
                >
                  Erneut versuchen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => {
      setIsLogin(value === 'login');
      setError('');
    }}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Anmelden</TabsTrigger>
        <TabsTrigger value="register">Registrieren</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">E-Mail-Adresse</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="ihre@email.ch"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Passwort</Label>
            <Input
              id="login-password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Anmeldung läuft...' : 'Anmelden'}
          </Button>

          <div className="text-center">
            <Button 
              type="button" 
              variant="link"
              onClick={() => setShowPasswordReset(true)}
              className="text-sm text-blue-600 p-0 h-auto"
            >
              Passwort vergessen?
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="register">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Kontotyp wählen</Label>
            <RadioGroup 
              value={formData.accountType} 
              onValueChange={(value) => handleInputChange('accountType', value)}
              className="grid grid-cols-1 gap-3"
            >
              <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <User size={20} className="text-blue-600" />
                  <div>
                    <div className="font-medium">Privatperson</div>
                    <div className="text-sm text-gray-500">Jobs ausschreiben und durchsuchen</div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <Building2 size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium">Unternehmen</div>
                    <div className="text-sm text-gray-500">Jobs ausschreiben und Angebote abgeben</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-name">
              {formData.accountType === 'company' ? 'Firmenname' : 'Vollständiger Name'}
            </Label>
            <Input
              id="register-name"
              type="text"
              placeholder={formData.accountType === 'company' ? 'Ihre Firma AG' : 'Max Mustermann'}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">E-Mail-Adresse</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="ihre@email.ch"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Passwort</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="Mindestens 6 Zeichen"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Passwort bestätigen</Label>
            <Input
              id="register-confirm-password"
              type="password"
              placeholder="Passwort wiederholen"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Registrierung läuft...' : 'Konto erstellen'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}