import { createAction, props } from "@ngrx/store";
import { Event } from "../../models/event.model";

export const loadEvents = 
createAction('[Events] Load Events');

export const loadEventsSuccess = 
createAction('[Events] Load Events Success', props<{events: Event[]}>());

export const loadEventsFailure = 
createAction('[Events] Load Events Failure', props<{error: string}>());

export const startOddsSimulation = 
createAction('[Events] Start Odds Simulation');


export const oddsUpdated = 
createAction('[Events] Odds Updated', 
    props<{eventId: string, newOdds: {home: number, draw?: number, away: number}}>());


export const loadEventById = createAction('[Events] Load Event By Id', props<{id: string}>());
export const loadEventByIdSuccess = createAction('[Events] Load Event By Id Success', props<{event: Event}>());
export const loadEventByIdFailure = createAction('[Events] Load Event By Id Failure', props<{error: string}>());

export const createEvent = createAction('[Events] Create Event', props<{event: Event}>());
export const createEventSuccess = createAction('[Events] Create Event Success', props<{event: Event}>());
export const createEventFailure = createAction('[Events] Create Event Failure', props<{error: string}>());

export const deleteEvent = createAction('[Events] Delete Event', props<{id: string}>());
export const deleteEventSuccess = createAction('[Events] Delete Event Success', props<{id: string}>());
export const deleteEventFailure = createAction('[Events] Delete Event Failure', props<{error: string}>());

export const updateEvent = createAction('[Events] Update Event', props<{id: string, event: Event}>());
export const updateEventSuccess = createAction('[Events] Update Event Success', props<{event: Event}>());
export const updateEventFailure = createAction('[Events] Update Event Failure', props<{error: string}>());