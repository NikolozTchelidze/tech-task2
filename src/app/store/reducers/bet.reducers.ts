import { createReducer, on } from "@ngrx/store";
import * as BetActions from "../actions/bet.actions";
import { initialBetsState } from "../app.state";

export const betReducer = createReducer(
    initialBetsState,
    on(BetActions.addBet, (state, { bet }) => ({ 
        ...state, 
        bets: [...state.bets, bet] 
    })),
    on(BetActions.removeBet, (state, { id }) => ({ 
        ...state, 
        bets: state.bets.filter(bet => bet.id !== id) 
    })),
    on(BetActions.clearBetslip, (state) => ({ 
        ...state, 
        bets: [] 
    }))
);