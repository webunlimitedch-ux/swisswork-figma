import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Lock } from 'lucide-react';
import { auth } from '../lib/supabase';

interface PasswordResetConfirmProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PasswordResetConfirm({ onSuccess, onError }: PasswordResetConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      setLoading(false);
      return;
    }

    try {
      const { error } = await auth.updatePassword(newPassword);

      if (error) {
        setError('Passwort-Update fehlgeschlagen: ' + error.message);
        setLoading(false);
        return;
      }

      setResetSuccess(true);
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      console.error('Password update error:', error);
      setError('Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  if (resetSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Passwort erfolgreich geändert!</h3>
            <p className="text-gray-600 mb-4">
              Ihr Passwort wurde erfolgreich aktualisiert. Sie werden automatisch zur Anmeldung weitergeleitet.
            </p>
            <Button onClick={onSuccess} className="w-full">
              Zur Anmeldung
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} className="text-blue-600" />
            Neues Passwort setzen
          </CardTitle>
          <CardDescription>
            Geben Sie Ihr neues Passwort ein, um den Reset-Prozess abzuschließen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Neues Passwort</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mindestens 6 Zeichen"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Passwort bestätigen</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Neues Passwort wiederholen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Passwort wird aktualisiert...' : 'Passwort ändern'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}