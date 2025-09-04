import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBudget(budget: number): string {
  if (budget >= 1000) {
    return `CHF ${(budget / 1000).toFixed(1)}k`
  }
  return `CHF ${budget.toLocaleString()}`
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Vor weniger als einer Stunde'
  } else if (diffInHours < 24) {
    return `Vor ${diffInHours} Stunde${diffInHours > 1 ? 'n' : ''}`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `Vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}