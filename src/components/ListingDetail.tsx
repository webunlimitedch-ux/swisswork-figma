import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import { ArrowLeft, DollarSign, Clock, MapPin, Send, Building2, Star, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ListingDetail({ listing, accessToken, userProfile, onBack, onAuthRequired, onEdit, onNavigateToProfile }) {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    proposal: '',
    price: '',
    timeline: '',
    examples: ''
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentListing, setCurrentListing] = useState(listing);

  useEffect(() => {
    // Refresh listing data to get latest offers
    refreshListing();
  }, []);

  async function refreshListing() {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings/${listing.id}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentListing(data);
      }
    } catch (error) {
      console.error('Error refreshing listing:', error);
    }
  }

  async function handleDeleteListing() {
    try {
      setDeleteLoading(true);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/listings/${currentListing.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Fehler beim Löschen der Stellenausschreibung');
        return;
      }

      // Navigate back to listings after successful deletion
      onBack();
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Ein Fehler ist beim Löschen aufgetreten');
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleOfferInputChange(field, value) {
    setOfferData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  }

  async function handleSubmitOffer(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!offerData.proposal || !offerData.price || !offerData.timeline) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f4f78c5a/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          listingId: currentListing.id,
          ...offerData,
          examples: offerData.examples.split('\n').filter(line => line.trim())
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler beim Übermitteln des Angebots');
        return;
      }

      setSuccess(true);
      setShowOfferForm(false);
      await refreshListing();
      
    } catch (error) {
      console.error('Error submitting offer:', error);
      setError('Ein Fehler ist beim Übermitteln Ihres Angebots aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  function formatBudget(budget) {
    if (budget >= 1000) {
      return `CHF ${(budget / 1000).toFixed(1)}k`;
    }
    return `CHF ${budget}`;
  }

  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vor weniger als einer Stunde';
    } else if (diffInHours < 24) {
      return `Vor ${diffInHours} Stunde${diffInHours > 1 ? 'n' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
    }
  }

  const hasUserMadeOffer = currentListing.offers?.some(offer => offer.companyId === userProfile?.id);
  const isCompany = userProfile?.accountType === 'company';
  const isListingOwner = userProfile && currentListing.clientId === userProfile.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Zurück zu Jobs
        </Button>
        
        {isListingOwner && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(currentListing)}
            >
              <Edit3 size={14} className="mr-2" />
              Bearbeiten
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 size={14} className="mr-2" />
                  )}
                  Löschen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Stellenausschreibung löschen</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sind Sie sicher, dass Sie diese Stellenausschreibung löschen möchten? 
                    Diese Aktion kann nicht rückgängig gemacht werden und alle zugehörigen 
                    Angebote gehen verloren.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteListing}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Ja, löschen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Ihr Angebot wurde erfolgreich übermittelt! Der Kunde kann es überprüfen und Sie kontaktieren, wenn er interessiert ist.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-3">{currentListing.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {currentListing.category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <DollarSign size={14} />
                  {formatBudget(currentListing.budget)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock size={14} />
                  {currentListing.timeline}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <MapPin size={14} />
                  Schweiz
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">
                Veröffentlicht {getTimeAgo(currentListing.createdAt)}
              </p>
              {currentListing.updatedAt && currentListing.updatedAt !== currentListing.createdAt && (
                <p className="text-sm text-gray-500 mb-1">
                  Aktualisiert {getTimeAgo(currentListing.updatedAt)}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {currentListing.offers?.length || 0} Angebot{(currentListing.offers?.length || 0) !== 1 ? 'e' : ''}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg mb-3">Projektbeschreibung</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {currentListing.description}
                </p>
              </div>
            </div>

            {!isListingOwner && !hasUserMadeOffer && (
              <div className="border-t pt-6">
                {!accessToken ? (
                  <div className="text-center py-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg mb-2">Angebot abgeben</h3>
                    <p className="text-gray-600 mb-4">
                      Melden Sie sich an, um ein Angebot für diesen Job abzugeben
                    </p>
                    <Button onClick={onAuthRequired}>
                      <Send size={16} className="mr-2" />
                      Jetzt anmelden und Angebot abgeben
                    </Button>
                  </div>
                ) : !isCompany ? (
                  <div className="text-center py-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <Building2 className="mx-auto mb-3 text-orange-600" size={32} />
                    <h3 className="text-lg mb-2 text-orange-900">Firmenkonto erforderlich</h3>
                    <p className="text-orange-700 mb-4">
                      Um Angebote auf Jobs abzugeben, benötigen Sie ein Firmenkonto. Dies stellt sicher, dass nur seriöse Dienstleister Angebote abgeben können.
                    </p>
                    <p className="text-sm text-orange-600 mb-4">
                      Sie können Ihr bestehendes Privatperson-Konto einfach in ein Firmenkonto umwandeln.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={onAuthRequired}>
                        Neues Firmenkonto erstellen
                      </Button>
                      <Button 
                        onClick={() => onNavigateToProfile()}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <ArrowRight size={16} className="mr-2" />
                        Konto umwandeln
                      </Button>
                    </div>
                  </div>
                ) : !showOfferForm ? (
                  <Button 
                    onClick={() => setShowOfferForm(true)}
                    className="w-full md:w-auto"
                  >
                    <Send size={16} className="mr-2" />
                    Angebot abgeben
                  </Button>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ihr Angebot abgeben</CardTitle>
                      <CardDescription>
                        Geben Sie Details darüber an, wie Sie an dieses Projekt herangehen würden
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitOffer} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="proposal">Projektvorschlag *</Label>
                          <Textarea
                            id="proposal"
                            placeholder="Erklären Sie, wie Sie an dieses Projekt herangehen würden, Ihre Methodik und was Sie zur richtigen Wahl macht..."
                            value={offerData.proposal}
                            onChange={(e) => handleOfferInputChange('proposal', e.target.value)}
                            rows={4}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="price">Ihr Preis (CHF) *</Label>
                            <Input
                              id="price"
                              type="number"
                              placeholder="5000"
                              value={offerData.price}
                              onChange={(e) => handleOfferInputChange('price', e.target.value)}
                              required
                              min="1"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="timeline">Liefertermin *</Label>
                            <Input
                              id="timeline"
                              placeholder="z.B. 2-3 Wochen"
                              value={offerData.timeline}
                              onChange={(e) => handleOfferInputChange('timeline', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="examples">Portfolio-Beispiele (optional)</Label>
                          <Textarea
                            id="examples"
                            placeholder="Teilen Sie Links zu relevanten Arbeitsbeispielen (einen pro Zeile)&#10;https://beispiel.com/portfolio-item-1&#10;https://beispiel.com/portfolio-item-2"
                            value={offerData.examples}
                            onChange={(e) => handleOfferInputChange('examples', e.target.value)}
                            rows={3}
                          />
                          <p className="text-sm text-gray-500">
                            Fügen Sie URLs hinzu, um relevante Arbeitsbeispiele zu zeigen
                          </p>
                        </div>

                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowOfferForm(false)}
                            className="flex-1"
                          >
                            Abbrechen
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1"
                          >
                            {loading ? 'Übermitteln...' : 'Angebot abgeben'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {isListingOwner && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  Dies ist Ihre eigene Stellenausschreibung. Sie können die Angebote unten einsehen und potenzielle Dienstleister kontaktieren.
                </AlertDescription>
              </Alert>
            )}

            {!isListingOwner && hasUserMadeOffer && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  Sie haben bereits ein Angebot für diesen Job abgegeben. Der Kunde wird Sie kontaktieren, wenn er interessiert ist.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {currentListing.offers && currentListing.offers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Aktuelle Angebote ({currentListing.offers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentListing.offers.map((offer, index) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-500" />
                      <span className="font-medium">{offer.companyName}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">CHF {offer.price}</p>
                      <p className="text-sm text-gray-500">{offer.timeline}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{offer.proposal}</p>
                  
                  {offer.examples && offer.examples.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Portfolio-Beispiele:</p>
                      <div className="space-y-1">
                        {offer.examples.map((example, i) => (
                          <a 
                            key={i} 
                            href={example} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm block"
                          >
                            {example}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-3">
                    Übermittelt {getTimeAgo(offer.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}