import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilityService {
  
  /**
   * Format date to locale string (used in bet history)
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format date for datetime-local input (used in events service)
   */
  formatDateForInput(dateInput?: string | Date): string {
    if (!dateInput) return '';
    
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Generate random date within last 30 days (used in bet history)
   */
  generateRandomDate(): string {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const randomDate = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
    return randomDate.toISOString();
  }

  /**
   * Get current timestamp (used in betslip and event details)
   */
  getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}
