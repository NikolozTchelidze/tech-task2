import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly APP_STATE_STORAGE_KEY = 'app-state';

  /**
   * Saves the application state to localStorage
   * @param state - The complete application state to save
   */
  saveAppStateToLocalStorage(state: any): void {
    try {
      localStorage.setItem(this.APP_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving app state to localStorage:', error);
    }
  }

  /**
   * Loads the application state from localStorage
   * @returns The saved state or null if not found
   */
  loadAppStateFromLocalStorage(): any | null {
    try {
      const savedState = localStorage.getItem(this.APP_STATE_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
      console.error('Error loading app state from localStorage:', error);
      return null;
    }
  }

  /**
   * Clears the application state from localStorage
   */
  clearAppStateFromLocalStorage(): void {
    try {
      localStorage.removeItem(this.APP_STATE_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing app state from localStorage:', error);
    }
  }
}
