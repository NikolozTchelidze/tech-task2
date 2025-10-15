import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BetsService } from "../../services/bets.service";
import * as BetActions from "../actions/bet.actions";
import { catchError, map, of, switchMap, forkJoin } from "rxjs";

@Injectable()
export class BetEffects {
    private actions$ = inject(Actions);
    private betsService = inject(BetsService);

    loadBets$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BetActions.loadBets),
            switchMap(() => this.betsService.getAllBets().pipe(
                map(bets => BetActions.loadBetsSuccess({ bets })),
                catchError((error) => {
                    console.error('Error loading bets from database, falling back to localStorage:', error);
                    const localStorageBets = this.betsService.getBetslipFromLocalStorage();
                    return of(BetActions.loadBetsSuccess({ bets: localStorageBets }));
                })
            ))
        )
    );

    addBet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BetActions.addBet),
            switchMap((action) => this.betsService.addBet(action.bet).pipe(
                map((bet) => {
                    // Also save to localStorage for persistence
                    const existingBets = this.betsService.getBetslipFromLocalStorage();
                    this.betsService.saveBetslipToLocalStorage([...existingBets, bet]);
                    return BetActions.addBetSuccess({ bet });
                }),
                catchError((error) => {
                    console.error('Error saving bet to database, saving to localStorage only:', error);
                    // Still save to localStorage even if database fails
                    const existingBets = this.betsService.getBetslipFromLocalStorage();
                    this.betsService.saveBetslipToLocalStorage([...existingBets, action.bet]);
                    return of(BetActions.addBetFailure({ error: error.message }));
                })
            ))
        )
    );

    removeBet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BetActions.removeBet),
            switchMap((action) => this.betsService.deleteBet(action.id).pipe(
                map(() => {
                    // Also remove from localStorage
                    const existingBets = this.betsService.getBetslipFromLocalStorage();
                    const updatedBets = existingBets.filter(bet => bet.id !== action.id);
                    this.betsService.saveBetslipToLocalStorage(updatedBets);
                    return BetActions.removeBetSuccess({ id: action.id });
                }),
                catchError((error) => of(BetActions.removeBetFailure({ error: error.message })))
            ))
        )
    );

    clearBetslip$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BetActions.clearBetslip),
            switchMap(() => this.betsService.getAllBets()),
            switchMap(bets => {
                if (bets.length === 0) {
                    // No bets to delete, just clear localStorage
                    this.betsService.clearBetslipFromLocalStorage();
                    return of(BetActions.clearBetslipSuccess());
                }
                
                // Delete all bets from database using forkJoin
                const deleteObservables = bets.map(bet => this.betsService.deleteBet(bet.id));
                return forkJoin(deleteObservables).pipe(
                    map(() => {
                        this.betsService.clearBetslipFromLocalStorage();
                        return BetActions.clearBetslipSuccess();
                    }),
                    catchError((error) => {
                        console.error('Error deleting bets from database:', error);
                        // Still clear localStorage even if database deletion fails
                        this.betsService.clearBetslipFromLocalStorage();
                        return of(BetActions.clearBetslipFailure({ error: error.message }));
                    })
                );
            }),
            catchError((error) => of(BetActions.clearBetslipFailure({ error: error.message })))
        )
    );
}
