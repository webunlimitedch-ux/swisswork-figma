/**
 * Format budget amount for display
 */
export function formatBudget(budget: number): string {
  if (budget >= 1000) {
    return `CHF ${(budget / 1000).toFixed(1)}k`;
  }
  return `CHF ${budget.toLocaleString()}`;
}

/**
 * Format date to relative time string
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Vor weniger als einer Stunde';
  } else if (diffInHours < 24) {
    return `Vor ${diffInHours} Stunde${diffInHours > 1 ? 'n' : ''}`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `Vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
  }
}

/**
 * Get year from date string
 */
export function getJoinedYear(dateString: string): number {
  return new Date(dateString).getFullYear();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize and format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Swiss phone number formatting
  if (cleaned.startsWith('+41')) {
    return cleaned.replace(/(\+41)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return cleaned;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}