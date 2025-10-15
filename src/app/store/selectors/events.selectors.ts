import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectEventsState = (state: AppState) => state.events;

export const selectEvents = createSelector(
    selectEventsState,
    (eventsState) => eventsState.events
);

export const selectEventsLoading = createSelector(
    selectEventsState,
    (eventsState) => eventsState.loading
);

export const selectEventsError = createSelector(
    selectEventsState,
    (eventsState) => eventsState.error
);

export const selectSelectedEvent = createSelector(
    selectEventsState,
    (eventsState) => eventsState.selectedEvent
);