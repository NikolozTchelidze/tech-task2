import { Event } from '../models/event.model';
import { Bet } from '../models/bet.model';

// Events State
export interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
}

// Bets State
export interface BetsState {
  bets: Bet[];
  loading: boolean;
  error: string | null;
}

// Initial Events State
export const initialEventsState: EventsState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null
};

// Initial Bets State
export const initialBetsState: BetsState = {
  bets: [],
  loading: false,
  error: null
};

// App State
export interface AppState {
  events: EventsState;
  bets: BetsState;
}
