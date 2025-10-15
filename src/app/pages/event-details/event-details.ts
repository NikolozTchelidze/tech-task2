import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Event, EventStatus, SportType } from '../../models/event.model';
import { selectSelectedEvent } from '../../store/selectors/events.selectors';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import * as EventsActions from '../../store/actions/events.actions';
import { Bet } from '../../models/bet.model';
import { DateUtilityService } from '../../services/date-utility.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetails implements OnInit {
  private readonly store = inject(Store<AppState>);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);
  private readonly dateUtility = inject(DateUtilityService);
  
  eventForm!: FormGroup;
  // Signals
  readonly event = signal<Event | null>(null);
  readonly selectedBets = signal<Bet[]>([]);

  ngOnInit(): void {
    this.eventForm = this.eventsService.createEventForm();
    
    // Get event ID from route and load specific event
    this.route.params.pipe(
      map(params => params['id'])
    ).subscribe(id => {
      this.store.dispatch(EventsActions.loadEventById({ id }));
    });

    // Listen to selected event changes
    this.store.select(selectSelectedEvent).pipe(
    ).subscribe(event => {
      this.event.set(event);
      if (event) {
        this.eventForm.patchValue(event);
      }
    });
  }


  goBack(): void {
    this.router.navigate(['/events']);
  }

  // Form utility methods
  getSportOptions(): SportType[] {
    return ['football', 'basketball', 'tennis', 'volleyball'];
  }

  getStatusOptions(): EventStatus[] {
    return ['upcoming', 'live', 'finished'];
  }

  isDrawRequired(): boolean {
    return this.eventForm.get('sport')?.value === 'football';
  }

  updateEvent(): void {    
    if (this.eventForm.valid && this.event()) {
      
      const eventId = this.event()!.id;
      const formValue = this.eventForm.value;
    

      console.log(formValue);
      
      // Transform form data to Event object
      const updatedEvent: Event = {
        ...formValue,
        id: eventId,
        updatedAt: this.dateUtility.getCurrentTimestamp(),
        isLive: formValue.status === 'live',
      };
      
      this.store.dispatch(EventsActions.updateEvent({ id: eventId, event: updatedEvent }));
      this.router.navigate(['/events']);
    }
  }
}
