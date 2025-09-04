import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, ArrowLeft } from 'lucide-react';
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

const budgetRanges = [
  { label: 'Unter CHF 1.000', value: 1000 },
  { label: 'CHF 1.000 - 5.000', value: 5000 },
  { label: 'CHF 5.000 - 10.000', value: 10000 },
  { label: 'CHF 10.000 - 25.000', value: 25000 },
  { label: 'CHF 25.000+', value: 50000 },
];

const timelineOptions = [
  '1-2 Wochen',
  '2-4 Wochen',
  '1-2 Monate',
  '2-3 Monate',
  '3+ Monate',
  'Laufend'
];

export function CreateListing({ accessToken, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    timeline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.timeline) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler beim Erstellen der Ausschreibung');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error('Error creating listing:', error);
      setError('Ein Fehler ist beim Erstellen der Ausschreibung aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-green-600 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl mb-2">Ausschreibung erfolgreich erstellt!</h3>
          <p className="text-gray-600 mb-4">
            Ihre Stellenausschreibung ist jetzt online und Unternehmen können Angebote abgeben.
          </p>
          <p className="text-sm text-gray-500">
            Weiterleitung zum Dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={24} />
            Neuen Job ausschreiben
          </CardTitle>
          <CardDescription>
            Erstellen Sie eine Stellenausschreibung, um den perfekten Dienstleister für Ihr Projekt zu finden
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job-Titel *</Label>
              <Input
                id="title"
                placeholder="z.B. Logo-Design für Schweizer Restaurant"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Dienstleistungskategorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie die Art der benötigten Dienstleistung" />
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
              <Label htmlFor="description">Job-Beschreibung *</Label>
              <Textarea
                id="description"
                placeholder="Beschreiben Sie Ihr Projekt detailliert. Geben Sie Anforderungen, Erwartungen, Ergebnisse und spezielle Wünsche an..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                required
              />
              <p className="text-sm text-gray-500">
                Tipp: Seien Sie spezifisch bei Ihren Anforderungen, um die richtigen Dienstleister anzuziehen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget-Bereich *</Label>
                <Select 
                  value={formData.budget} 
                  onValueChange={(value) => handleInputChange('budget', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Budget-Bereich wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value.toString()}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Projekt-Zeitplan *</Label>
                <Select 
                  value={formData.timeline} 
                  onValueChange={(value) => handleInputChange('timeline', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Zeitplan wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((timeline) => (
                      <SelectItem key={timeline} value={timeline}>
                        {timeline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onSuccess()}
                className="flex-1"
              >
                <ArrowLeft size={16} className="mr-2" />
                Abbrechen
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Erstellen...' : 'Job ausschreiben'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}