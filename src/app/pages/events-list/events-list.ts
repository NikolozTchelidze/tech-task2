import { Component, OnInit, inject, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Event,SportType, BetOutcome } from '../../models/event.model';
import { AppState } from '../../store/app.state';
import * as EventsActions from '../../store/actions/events.actions';
import { selectEvents, selectEventsLoading, selectEventsError } from '../../store/selectors/events.selectors';
import { BetslipComponent } from '../../components/betslip/betslip.component';
import { BetHistoryComponent } from '../../components/bet-history/bet-history.component';

@Component({
  selector: 'app-events-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatBadgeModule,
    ScrollingModule
  ],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsList implements OnInit {
  private readonly store = inject(Store<AppState>);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Convert store observables directly to signals
  readonly events = toSignal(this.store.select(selectEvents), { initialValue: [] });
  readonly loading = toSignal(this.store.select(selectEventsLoading), { initialValue: false });
  readonly error = toSignal(this.store.select(selectEventsError), { initialValue: null });

  // Computed properties for template usage
  readonly isEmpty = computed(() => !this.loading() && this.events().length === 0);
  readonly hasEvents = computed(() => !this.loading() && this.events().length > 0);

  readonly selectedBets = signal<{event: Event, selection: BetOutcome}[]>([]);
  
  // Computed badge value for mat-badge
  readonly badgeCount = computed(() => this.selectedBets().length);
  
  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents());
    this.store.dispatch(EventsActions.startOddsSimulation());
  }

  getSportIcon(sport: SportType): string {
    switch (sport) {
      case 'football': return 'sports_soccer';
      case 'basketball': return 'sports_basketball';
      case 'tennis': return 'sports_tennis';
      case 'volleyball': return 'sports_volleyball';
      default: return 'sports';
    }
  }

  addEvent(): void {
    this.router.navigate(['/events/add']);
  }

  placeBet(event: Event, selection: BetOutcome): void {
    const existingBet = this.selectedBets().find(bet => 
      bet.event.id === event.id
    );
    
    if (!existingBet) {
      this.selectedBets.update(bets => [...bets, { event, selection }]);
    }
  }

  viewEventDetails(event: Event): void {
    this.router.navigate(['/events', event.id]);
  }

  deleteEvent(id: string): void {
    this.store.dispatch(EventsActions.deleteEvent({ id }));
  }

  openBetslip(): void {
    const dialogRef = this.dialog.open(BetslipComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { events: this.selectedBets() }
    });

    dialogRef.componentInstance.eventsChange.subscribe(updatedEvents => {
      this.selectedBets.set(updatedEvents);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Bets placed:', result);
        this.selectedBets.set([]);
      }
    });
  }

  openBetHistory(): void {
    const dialogRef = this.dialog.open(BetHistoryComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(() => {
      // History dialog closed - no action needed
    });
  }
}
