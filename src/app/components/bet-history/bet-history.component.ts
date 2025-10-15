import { Component, inject, signal, OnInit, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Bet } from '../../models/bet.model';
import { DateUtilityService } from '../../services/date-utility.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectBets } from '../../store/selectors/bet.selectors';
import * as BetActions from '../../store/actions/bet.actions';
import { toSignal } from '@angular/core/rxjs-interop';

export interface BetHistoryItem extends Bet {
  placedAt: string;
  potentialWinnings?: number;
}

@Component({
  selector: 'app-bet-history',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './bet-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetHistoryComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<BetHistoryComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);
  private readonly dateUtility = inject(DateUtilityService);
  private readonly store = inject(Store<AppState>);
  
  readonly betHistory = signal<BetHistoryItem[]>([]);
  readonly totalBets = signal<number>(0);
  readonly totalStake = signal<number>(0);
  readonly totalWinnings = signal<number>(0);

  // NgRx signals
  readonly bets = toSignal(this.store.select(selectBets), { initialValue: [] });

  constructor() {
    // Watch for changes in bets signal and process them
    effect(() => {
      const currentBets = this.bets();
      console.log('Bet history effect triggered, bets count:', currentBets.length);
      
      // Process bets regardless of length (handles both populated and empty arrays)
      this.processBets(currentBets);
    });
  }

  ngOnInit(): void {
    // Bets are automatically loaded from localStorage via meta-reducer
  }

  private processBets(bets: Bet[]): void {
    const historyItems: BetHistoryItem[] = bets.map(bet => ({
      ...bet,
      placedAt: bet.placedAt || this.dateUtility.generateRandomDate(),
      potentialWinnings: bet.stake ? bet.stake * bet.odds : 0
    }));

    historyItems.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

    this.betHistory.set(historyItems);
    this.calculateStatistics(historyItems);
  }

  private calculateStatistics(bets: BetHistoryItem[]): void {
    this.totalBets.set(bets.length);
    
    const totalStake = bets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
    this.totalStake.set(totalStake);

    const totalWinnings = bets.reduce((sum, bet) => sum + (bet.potentialWinnings || 0), 0);
    this.totalWinnings.set(totalWinnings);
  }

  formatDate(dateString: string): string {
    return this.dateUtility.formatDate(dateString);
  }

    clearHistory(): void {
        // Show confirmation dialog
        if (confirm('Are you sure you want to clear all bet history? This action cannot be undone.')) {
            // Dispatch action to clear bets from store only
            this.store.dispatch(BetActions.clearBetslip());
            // The component will automatically update via the effect() that watches bets signal
        }
    }

  close(): void {
    this.dialogRef.close();
  }
}
