import type { AuthFormData, CreateListingData, OfferFormData } from '../types';
import { isValidEmail, isValidUrl } from './formatters';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate authentication form data
 */
export function validateAuthForm(data: AuthFormData, isLogin: boolean = false): ValidationError[] {
  const errors: ValidationError[] = [];

  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'E-Mail-Adresse ist erforderlich' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Ungültige E-Mail-Adresse' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Passwort ist erforderlich' });
  } else if (!isLogin && data.password.length < 6) {
    errors.push({ field: 'password', message: 'Passwort muss mindestens 6 Zeichen lang sein' });
  }

  // Registration-specific validation
  if (!isLogin) {
    if (!data.name?.trim()) {
      errors.push({ field: 'name', message: 'Name ist erforderlich' });
    }

    if (data.confirmPassword !== data.password) {
      errors.push({ field: 'confirmPassword', message: 'Passwörter stimmen nicht überein' });
    }

    if (!data.accountType) {
      errors.push({ field: 'accountType', message: 'Kontotyp ist erforderlich' });
    }
  }

  return errors;
}

/**
 * Validate listing creation data
 */
export function validateListingForm(data: CreateListingData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Titel ist erforderlich' });
  } else if (data.title.length > 100) {
    errors.push({ field: 'title', message: 'Titel darf maximal 100 Zeichen lang sein' });
  }

  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: 'Beschreibung ist erforderlich' });
  } else if (data.description.length < 50) {
    errors.push({ field: 'description', message: 'Beschreibung muss mindestens 50 Zeichen lang sein' });
  }

  if (!data.category) {
    errors.push({ field: 'category', message: 'Kategorie ist erforderlich' });
  }

  if (!data.budget) {
    errors.push({ field: 'budget', message: 'Budget ist erforderlich' });
  } else {
    const budgetNum = parseInt(data.budget);
    if (isNaN(budgetNum) || budgetNum < 1) {
      errors.push({ field: 'budget', message: 'Budget muss eine positive Zahl sein' });
    }
  }

  if (!data.timeline?.trim()) {
    errors.push({ field: 'timeline', message: 'Zeitrahmen ist erforderlich' });
  }

  return errors;
}

/**
 * Validate offer form data
 */
export function validateOfferForm(data: OfferFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.proposal?.trim()) {
    errors.push({ field: 'proposal', message: 'Projektvorschlag ist erforderlich' });
  } else if (data.proposal.length < 100) {
    errors.push({ field: 'proposal', message: 'Projektvorschlag muss mindestens 100 Zeichen lang sein' });
  }

  if (!data.price) {
    errors.push({ field: 'price', message: 'Preis ist erforderlich' });
  } else {
    const priceNum = parseInt(data.price);
    if (isNaN(priceNum) || priceNum < 1) {
      errors.push({ field: 'price', message: 'Preis muss eine positive Zahl sein' });
    }
  }

  if (!data.timeline?.trim()) {
    errors.push({ field: 'timeline', message: 'Liefertermin ist erforderlich' });
  }

  // Validate portfolio examples if provided
  if (data.examples?.trim()) {
    const urls = data.examples.split('\n').filter(line => line.trim());
    for (const url of urls) {
      if (!isValidUrl(url.trim())) {
        errors.push({ field: 'examples', message: `Ungültige URL: ${url}` });
        break;
      }
    }
  }

  return errors;
}

/**
 * Validate profile data
 */
export function validateProfileForm(data: any, accountType: 'individual' | 'company'): ValidationError[] {
  const errors: ValidationError[] = [];

  if (accountType === 'company') {
    if (!data.companyName?.trim()) {
      errors.push({ field: 'companyName', message: 'Firmenname ist erforderlich' });
    }

    if (!data.category) {
      errors.push({ field: 'category', message: 'Kategorie ist erforderlich' });
    }

    if (data.website && !isValidUrl(data.website)) {
      errors.push({ field: 'website', message: 'Ungültige Website-URL' });
    }
  } else {
    if (!data.name?.trim()) {
      errors.push({ field: 'name', message: 'Name ist erforderlich' });
    }
  }

  return errors;
}