// utils.ts

/**
 * Combine multiple class names into a single string
 * 
 * @param classes - Class names to combine
 * @returns Combined class name string
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate a random unique ID string.
 * Useful for temporary keys or IDs before database assignment.
 */
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format a Date object as YYYY-MM-DD string.
 * Useful for consistent date storage/display.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date formatted as YYYY-MM-DD.
 */
export function getTodayDate(): string {
  return formatDate(new Date());
}

/**
 * Spaced Repetition helper function:
 * Calculate next review date based on interval (in days).
 * 
 * @param {Date} lastReviewDate - The date of the last review
 * @param {number} intervalDays - Interval in days until next review
 * @returns {string} - Next review date formatted as YYYY-MM-DD
 */
export function getNextReviewDate(lastReviewDate: Date, intervalDays: number): string {
  const nextDate = new Date(lastReviewDate);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return formatDate(nextDate);
}

/**
 * Clamp a number between min and max.
 * Useful for bounding intervals or ratings.
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Shuffle an array (Fisher-Yates shuffle).
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
