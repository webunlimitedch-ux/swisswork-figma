import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Edit3 } from 'lucide-react';
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

export function EditListing({ listing, accessToken, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    timeline: ''
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        category: listing.category || '',
        budget: listing.budget?.toString() || '',
        timeline: listing.timeline || ''
      });
    }
  }, [listing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.timeline) {
      setError('Bitte füllen Sie alle Felder aus');
      setLoading(false);
      return;
    }

    if (parseInt(formData.budget) < 1) {
      setError('Budget muss mindestens 1 CHF betragen');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings/${listing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: parseInt(formData.budget),
          timeline: formData.timeline
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler beim Aktualisieren der Stellenausschreibung');
        return;
      }

      onSuccess(data);
    } catch (error) {
      console.error('Error updating listing:', error);
      setError('Ein Fehler ist beim Aktualisieren aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft size={16} className="mr-2" />
          Zurück
        </Button>
        <div className="bg-blue-100 p-3 rounded-full">
          <Edit3 size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl">Stellenausschreibung bearbeiten</h2>
          <p className="text-gray-600">Aktualisieren Sie die Details Ihrer Stellenausschreibung</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job-Details bearbeiten</CardTitle>
          <CardDescription>
            Ändern Sie die Informationen zu Ihrer Stellenausschreibung. Bestehende Angebote bleiben erhalten.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Stellentitel *</Label>
              <Input
                id="title"
                placeholder="z.B. Website-Design für Bäckerei"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
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
              <Label htmlFor="description">Projektbeschreibung *</Label>
              <Textarea
                id="description"
                placeholder="Beschreiben Sie detailliert, was Sie benötigen, Ihre Anforderungen, Ziele und alle relevanten Details..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (CHF) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="5000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Zeitrahmen *</Label>
                <Input
                  id="timeline"
                  placeholder="z.B. 2-3 Wochen"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Aktualisieren...' : 'Änderungen speichern'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}