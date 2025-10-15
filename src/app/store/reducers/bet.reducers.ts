import { createReducer, on } from "@ngrx/store";
import * as BetActions from "../actions/bet.actions";
import { initialBetsState } from "../app.state";

export const betReducer = createReducer(
    initialBetsState,
    on(BetActions.loadBets, (state) => ({ ...state, loading: true, error: null })),
    on(BetActions.loadBetsSuccess, (state, { bets }) => ({ ...state, bets, loading: false })),
    on(BetActions.loadBetsFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(BetActions.addBet, (state) => ({ ...state, loading: true, error: null })),
    on(BetActions.addBetSuccess, (state, { bet }) => ({ ...state, bets: [...state.bets, bet], loading: false })),
    on(BetActions.addBetFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(BetActions.removeBet, (state) => ({ ...state, loading: true, error: null })),
    on(BetActions.removeBetSuccess, (state, { id }) => ({ ...state, bets: state.bets.filter(bet => bet.id !== id), loading: false })),
    on(BetActions.removeBetFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(BetActions.clearBetslip, (state) => ({ ...state, loading: true, error: null })),
    on(BetActions.clearBetslipSuccess, (state) => ({ ...state, bets: [], loading: false })),
    on(BetActions.clearBetslipFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
