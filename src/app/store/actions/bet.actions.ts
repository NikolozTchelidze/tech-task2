import { createAction, props } from "@ngrx/store";
import { Bet } from "../../models/bet.model";

export const loadBets = createAction('[Bet] Load Bets');
export const loadBetsSuccess = createAction('[Bet] Load Bets Success', props<{bets: Bet[]}>());
export const loadBetsFailure = createAction('[Bet] Load Bets Failure', props<{error: string}>());

export const addBet = createAction('[Bet] Add Bet', props<{bet: Bet}>());
export const addBetSuccess = createAction('[Bet] Add Bet Success', props<{bet: Bet}>());
export const addBetFailure = createAction('[Bet] Add Bet Failure', props<{error: string}>());

export const removeBet = createAction('[Bet] Remove Bet', props<{id: string}>());
export const removeBetSuccess = createAction('[Bet] Remove Bet Success', props<{id: string}>());
export const removeBetFailure = createAction('[Bet] Remove Bet Failure', props<{error: string}>());

export const clearBetslip = createAction('[Bet] Clear Betslip');
export const clearBetslipSuccess = createAction('[Bet] Clear Betslip Success');
export const clearBetslipFailure = createAction('[Bet] Clear Betslip Failure', props<{error: string}>());
