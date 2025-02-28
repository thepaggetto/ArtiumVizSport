import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createEventDaySlug(date: Date, broadcaster: string): string {
  const formattedDate = format(new Date(date), "yyyy-MM-dd")
  return `${broadcaster.toLowerCase()}-${formattedDate}`
}

export function parseEventDaySlug(slug: string): { date: string; broadcaster: string } {
  const [broadcaster, date] = slug.split("-")
  return {
    broadcaster: broadcaster.toUpperCase(),
    date,
  }
}

