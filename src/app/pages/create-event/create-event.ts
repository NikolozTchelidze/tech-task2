import { Component, inject ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as EventsActions from '../../store/actions/events.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-event.html',
  styleUrl: './create-event.scss'
})
export class CreateEvent implements OnInit{
  eventForm!: FormGroup;
  store = inject(Store);
  router = inject(Router);
  eventsService = inject(EventsService);
  
  ngOnInit(): void {
    this.eventForm = this.eventsService.createEventForm();
    
    // Watch sport changes to conditionally require draw odds
    this.eventForm.get('sport')?.valueChanges.subscribe(sport => {
      console.log('Sport changed:', sport);
      
      const drawControl = this.eventForm.get('odds.draw');
      if (sport === 'football') {
        drawControl?.setValidators([Validators.required, Validators.min(1.01), Validators.max(100)]);
      } else {
        drawControl?.clearValidators();
        drawControl?.setValue('');
      }
      drawControl?.updateValueAndValidity();
    });
  }

  createEvent() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
    
      const eventData = {
        ...formValue,
        odds: {
          home: parseFloat(formValue.odds.home),
          away: parseFloat(formValue.odds.away),
          draw: formValue.odds.draw ? parseFloat(formValue.odds.draw) : undefined
        }
      };

      if (formValue.sport !== 'football') {
        delete eventData.odds.draw;
      }

      this.store.dispatch(EventsActions.createEvent({ event: eventData }));
      this.router.navigate(['/events']);
    }
  }
}
