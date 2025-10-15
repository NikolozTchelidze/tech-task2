import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BetsState } from '../app.state';
import { Bet } from '../../models/bet.model';

export const selectBetState = createFeatureSelector<BetsState>('bets');

export const selectBets = createSelector(
  selectBetState,
  (state: BetsState) => state.bets
);

export const selectBetsLoading = createSelector(
  selectBetState,
  (state: BetsState) => state.loading
);

export const selectBetsError = createSelector(
  selectBetState,
  (state: BetsState) => state.error
);

export const selectBetslipCount = createSelector(
  selectBets,
  (bets: Bet[]) => bets.length
);

export const selectTotalStake = createSelector(
  selectBets,
  (bets: Bet[]) => bets.reduce((total, bet) => total + (bet.stake || 0), 0)
);

export const selectPotentialWinnings = createSelector(
  selectBets,
  (bets: Bet[]) => bets.reduce((total, bet) => total + ((bet.stake || 0) * bet.odds), 0)
);

export const selectBetById = (id: string) => createSelector(
  selectBets,
  (bets: Bet[]) => bets.find(bet => bet.id === id)
);
