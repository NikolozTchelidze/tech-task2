import { ActionReducerMap } from '@ngrx/store';
import { EventsState, BetsState } from '../app.state';
import { eventsReducer } from './events.reducers';
import { betReducer } from './bet.reducers';

export interface AppState {
  events: EventsState;
  bets: BetsState;
}

export const reducers: ActionReducerMap<AppState> = {
  events: eventsReducer,
  bets: betReducer
};
