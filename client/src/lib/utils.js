import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateCouponCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function isCutoffTime() {
  const now = new Date();
  const hours = now.getHours();
  // Return true if it's after 8 PM (20:00)
  return hours >= 20;
}

export function getTimeRemaining() {
  const now = new Date();
  const cutoffTime = new Date(now);
  cutoffTime.setHours(20, 0, 0, 0);
  
  // If it's already past the cutoff, return 0
  if (now >= cutoffTime) {
    return "0 hours 0 minutes";
  }
  
  const diffMs = cutoffTime - now;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  
  return `${diffHrs} hours ${diffMins} minutes`;
}
