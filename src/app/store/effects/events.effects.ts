import { inject, Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { EventsService } from "../../services/events.service";
import { createEffect } from "@ngrx/effects";
import * as EventsActions from "../actions/events.actions";
import { catchError, map, of, switchMap, delay, mergeMap } from "rxjs";
import { OddsUpdateService } from "../../services/odssUpdateService.service";
@Injectable()
export class EventsEffects {
    actions$ = inject(Actions);
    eventsService = inject(EventsService);
    oddsUpdateService = inject(OddsUpdateService);
    loadEvents$ = createEffect(
        () =>
        this.actions$.pipe(
            ofType(EventsActions.loadEvents),
            switchMap(() => this.eventsService.loadEvents()),
            map((events) => EventsActions.loadEventsSuccess({ events })),
            catchError((error) => of(EventsActions.loadEventsFailure({ error: error.message })))
        ))

    startOddsSimulation$ = createEffect(() => 
        this.actions$.pipe(
            ofType(EventsActions.startOddsSimulation),
            switchMap(() => this.oddsUpdateService.startOddsSimulation().pipe(
                map((oddsUpdate) => EventsActions.oddsUpdated({ ...oddsUpdate }))
            ))
        )
    )

    loadEventById$ = createEffect(() => 
        this.actions$.pipe(
            ofType(EventsActions.loadEventById),
            switchMap((action) => this.eventsService.loadEventById(action.id).pipe(
                map((event) => EventsActions.loadEventByIdSuccess({ event })),
                catchError((error) => of(EventsActions.loadEventByIdFailure({ error: error.message })))
            ))
        )
    )

    createEvent$ = createEffect(() => 
        this.actions$.pipe(
            ofType(EventsActions.createEvent),
            switchMap((action) => this.eventsService.createEvent(action.event).pipe(
                map((event) => EventsActions.createEventSuccess({ event })),
                catchError((error) => of(EventsActions.createEventFailure({ error: error.message })))
            ))
        )
    )

    deleteEvent$ = createEffect(() => 
        this.actions$.pipe(
            ofType(EventsActions.deleteEvent),
            switchMap((action) => this.eventsService.deleteEvent(action.id).pipe(
                map(() => EventsActions.deleteEventSuccess({ id: action.id })),
                catchError((error) => of(EventsActions.deleteEventFailure({ error: error.message })))
            ))
        )
    )

    updateEvent$ = createEffect(() => 
        this.actions$.pipe(
            ofType(EventsActions.updateEvent),
            switchMap((action) => this.eventsService.updateEvent(action.event).pipe(
                map((event) => EventsActions.updateEventSuccess({ event })),
                catchError((error) => of(EventsActions.updateEventFailure({ error: error.message })))
            ))
        )
    )
}