import { Component, inject, signal, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { Bet } from '../../models/bet.model';
import { Event, BetOutcome } from '../../models/event.model';
import { DateUtilityService } from '../../services/date-utility.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as BetActions from '../../store/actions/bet.actions';

@Component({
  selector: 'app-betslip',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './betslip.component.html',
  styles: []
})
export class BetslipComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<BetslipComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);
  private readonly dateUtility = inject(DateUtilityService);
  private readonly store = inject(Store<AppState>);
  
  readonly events = signal<{event: Event, selection: BetOutcome}[]>([]);
  readonly amount  = signal<number>(0);
  readonly potentialWinnings = signal<number>(0);
  
  // Output to communicate changes back to parent
  readonly eventsChange = output<{event: Event, selection: BetOutcome}[]>();

  ngOnInit(): void {
    if (this.dialogData && this.dialogData['events']) {
      this.events.set(this.dialogData['events']);
    }
  }

  removeBet(eventId: string): void {
    // Update local events
    this.events.update(bets => bets.filter(bet => bet.event.id !== eventId));
    
    // Emit changes to parent
    this.eventsChange.emit(this.events());
    
    // Recalculate potential winnings
    this.calculatePotentialWinnings();
  }

  onAmountChange(): void {
    this.calculatePotentialWinnings();
  }

  calculatePotentialWinnings(): void {
    const events = this.events();
    const amount = this.amount();
    
    if (events.length === 0 || amount === 0) {
      this.potentialWinnings.set(0);
      return;
    }

    // Calculate combined odds (multiply all odds together)
    const combinedOdds = events.reduce((product, bet) => {
      const odds = bet.event.odds[bet.selection] || 0;
      return product * odds;
    }, 1);

    // Total potential winnings = amount * combined odds
    this.potentialWinnings.set(amount * combinedOdds);
  }


  placeBet(): void {
    const events = this.events();
    const amount = this.amount();
    
    if (events.length === 0 || amount === 0) {
      return;
    }

    const bets: Bet[] = events.map((eventSelection) => ({
      id: Math.floor(Math.random() * 20) + 1 + '',
      eventId: eventSelection.event.id,
      eventTitle: eventSelection.event.title,
      selection: eventSelection.selection,
      odds: eventSelection.event.odds[eventSelection.selection] || 0,
      stake: amount,
      placedAt: this.dateUtility.getCurrentTimestamp()
    }));

    // Dispatch add bet actions for each bet
    bets.forEach(bet => {
      this.store.dispatch(BetActions.addBet({ bet }));
    });
    
    this.closeDialog();
  }

  private closeDialog(): void {
    this.events.set([]);
    this.amount.set(0);
    this.potentialWinnings.set(0);
    this.eventsChange.emit([]);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close(this.events());
  }
}

