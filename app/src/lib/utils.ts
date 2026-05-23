import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns today's date as ISO string YYYY-MM-DD in UTC */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}
