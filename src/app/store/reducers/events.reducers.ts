import { on } from "@ngrx/store";
import * as EventsActions from "../actions/events.actions";
import { createReducer } from "@ngrx/store";
import { initialEventsState } from "../app.state";

export const eventsReducer = createReducer(
    initialEventsState,
    on(EventsActions.loadEvents, (state) => ({ ...state, loading: true, error: null })),
    on(EventsActions.loadEventsSuccess, (state, { events }) => ({ 
        ...state, 
        events: events,
        loading: false 
    })),
    on(EventsActions.loadEventsFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(EventsActions.loadEventById, (state) => ({ ...state, loading: true, error: null })),
    on(EventsActions.loadEventByIdSuccess, (state, { event }) => ({ ...state, selectedEvent: event, loading: false })),
    on(EventsActions.loadEventByIdFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(EventsActions.oddsUpdated, (state, { eventId, newOdds }) => ({
        ...state,
        events: state.events.map(event => 
            event.id === eventId ? { ...event, odds: newOdds } : event
        )
    })),
    on(EventsActions.createEvent, (state) => ({ ...state, loading: true, error: null })),
    on(EventsActions.createEventSuccess, (state, { event }) => ({ 
        ...state, 
        events: state.events.some(e => e.id === event.id) 
            ? state.events.map(e => e.id === event.id ? event : e) 
            : [...state.events, event],
        loading: false 
    })),
    on(EventsActions.createEventFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(EventsActions.deleteEvent, (state) => ({ ...state, loading: true, error: null })),
    on(EventsActions.deleteEventSuccess, (state, { id }) => ({ ...state, events: state.events.filter(e => e.id !== id), loading: false })),
    on(EventsActions.deleteEventFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(EventsActions.updateEvent, (state) => ({ ...state, loading: true, error: null })),
    on(EventsActions.updateEventSuccess, (state, { event }) => ({ ...state, events: state.events.map(e => e.id === event.id ? event : e), loading: false })),
    on(EventsActions.updateEventFailure, (state, { error }) => ({ ...state, error, loading: false }))
);