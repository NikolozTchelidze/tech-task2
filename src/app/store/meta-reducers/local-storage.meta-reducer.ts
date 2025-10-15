import { MetaReducer, ActionReducer, Action } from '@ngrx/store';
import { AppState } from '../app.state';
import { LocalStorageService } from '../../services/local-storage.service';

const localStorageService = new LocalStorageService();

export function createLocalStoragePersistenceMetaReducer(reducer: ActionReducer<AppState, Action>): ActionReducer<AppState, Action> {
  return (state: AppState | undefined, action: Action): AppState => {
    // Load state from localStorage on app initialization
    if (action.type === '@ngrx/store/init') {
      const savedState = localStorageService.loadAppStateFromLocalStorage();
      if (savedState) {
        return { ...state, ...savedState } as AppState;
      }
    }

    // Run the normal reducer
    const newState = reducer(state, action);

    // Save state to localStorage after each action (except init)
    if (action.type !== '@ngrx/store/init') {
      localStorageService.saveAppStateToLocalStorage(newState);
    }

    return newState;
  };
}

export const metaReducers: MetaReducer<AppState>[] = [createLocalStoragePersistenceMetaReducer];
