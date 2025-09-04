import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Building2, User, Phone, Globe, MapPin, ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const categories = [
  'Web Design & Entwicklung',
  'Grafikdesign',
  'Marketing & Werbung',
  'Content-Erstellung',
  'Fotografie',
  'Videoproduktion',
  'Beratung',
  'Übersetzung',
  'Rechtsdienstleistungen',
  'Buchhaltung',
  'Andere'
];

export function CompanyProfile({ accessToken, userProfile, onProfileUpdate }) {
  const [loading, setLoading] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [convertCompanyName, setConvertCompanyName] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    description: '',
    category: '',
    website: '',
    phone: '',
    location: '',
    accountType: 'company'
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        companyName: userProfile.companyName || '',
        name: userProfile.name || '',
        description: userProfile.description || '',
        category: userProfile.category || '',
        website: userProfile.website || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        accountType: userProfile.accountType || 'company'
      });
    }
  }, [userProfile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation based on account type
    if (formData.accountType === 'company') {
      if (!formData.companyName.trim()) {
        setError('Firmenname ist erforderlich');
        setLoading(false);
        return;
      }
      if (!formData.category) {
        setError('Bitte wählen Sie eine Kategorie');
        setLoading(false);
        return;
      }
    } else {
      if (!formData.name.trim()) {
        setError('Name ist erforderlich');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler beim Speichern des Profils');
        return;
      }

      setSuccess('Profil erfolgreich aktualisiert!');
      onProfileUpdate(data);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Ein Fehler ist beim Speichern aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  async function handleConvertToCompany() {
    if (!convertCompanyName.trim()) {
      setError('Bitte geben Sie einen Firmennamen ein');
      return;
    }

    setConvertLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/convert-to-company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ companyName: convertCompanyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler bei der Kontoumwandlung');
        return;
      }

      setSuccess('Ihr Konto wurde erfolgreich in ein Firmenkonto umgewandelt! Sie können nun Angebote auf Jobs abgeben.');
      onProfileUpdate(data);
      setConvertCompanyName('');
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error converting to company:', error);
      setError('Ein Fehler ist bei der Umwandlung aufgetreten');
    } finally {
      setConvertLoading(false);
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  }

  const isCompany = formData.accountType === 'company';

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
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isCompany ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firmenname *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Ihre Firma AG"
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
                      {categories.map((category) => (
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
                    placeholder="Beschreiben Sie Ihr Unternehmen und Ihre Dienstleistungen..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://ihre-website.ch"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+41 XX XXX XX XX"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Zürich, Schweiz"
                      className="pl-10"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Vollständiger Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Max Mustermann"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <User className="text-blue-600 mt-1" size={20} />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-2">Privatperson-Konto</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Als Privatperson können Sie:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1 mb-3">
                        <li>• Jobs ausschreiben und Angebote erhalten</li>
                        <li>• Jobs und Unternehmen durchsuchen</li>
                      </ul>
                      <p className="text-sm text-blue-600 font-medium mb-4">
                        Um Angebote auf Jobs abzugeben, benötigen Sie ein Firmenkonto.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="text-green-600 mt-1" size={20} />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-2">Zu Firmenkonto wechseln</h4>
                      <p className="text-sm text-green-700 mb-4">
                        Wandeln Sie Ihr Privatperson-Konto in ein Firmenkonto um, um Angebote auf Jobs abzugeben und alle Funktionen von SwissWork zu nutzen.
                      </p>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                            <Building2 size={16} className="mr-2" />
                            In Firmenkonto umwandeln
                            <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konto zu Firmenkonto umwandeln</AlertDialogTitle>
                            <AlertDialogDescription>
                              Durch die Umwandlung erhalten Sie Zugang zu allen Funktionen:
                              <br />• Angebote auf Jobs abgeben
                              <br />• Als Unternehmen gelistet werden
                              <br />• Erweiterte Profilinformationen
                              <br /><br />
                              Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor="convert-company-name">Firmenname *</Label>
                            <Input
                              id="convert-company-name"
                              value={convertCompanyName}
                              onChange={(e) => setConvertCompanyName(e.target.value)}
                              placeholder="Ihre Firma AG"
                              required
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setConvertCompanyName('')}>
                              Abbrechen
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConvertToCompany}
                              disabled={convertLoading || !convertCompanyName.trim()}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {convertLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Umwandeln...
                                </>
                              ) : (
                                'Ja, zu Firmenkonto umwandeln'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Speichern...' : 'Profil speichern'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}