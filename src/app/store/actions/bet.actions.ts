import { createAction, props } from "@ngrx/store";
import { Bet } from "../../models/bet.model";

// Add bet to store
export const addBet = createAction('[Bet] Add Bet', props<{bet: Bet}>());

// Remove bet from store
export const removeBet = createAction('[Bet] Remove Bet', props<{id: string}>());

// Clear all bets from store
export const clearBetslip = createAction('[Bet] Clear Betslip');