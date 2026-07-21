import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function generateOrderId(): string {
  return 'COS-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '💻', color: '#3b5bf5' },
  { id: 'fashion', name: 'Fashion', icon: '👗', color: '#ff24c2' },
  { id: 'home', name: 'Home & Garden', icon: '🏠', color: '#10b981' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#f59e0b' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: '#ec4899' },
  { id: 'books', name: 'Books', icon: '📚', color: '#8b5cf6' },
  { id: 'toys', name: 'Toys & Games', icon: '🎮', color: '#ef4444' },
  { id: 'food', name: 'Food & Drink', icon: '🍕', color: '#f97316' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', color: '#6b7280' },
  { id: 'health', name: 'Health', icon: '💊', color: '#14b8a6' },
];
