import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { DateUtilityService } from './date-utility.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly dateUtility = inject(DateUtilityService);

  /**
   * Load all events from API
   */
  loadEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiUrl}/events`);
  }
  
  loadEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${environment.apiUrl}/events/${id}`);
  }

  createEvent(event:Event): Observable<Event> {
    return this.http.post<Event>(`${environment.apiUrl}/events`, event);
  }
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/events/${id}`);
  }
  updateEvent(event:Event): Observable<Event> {
    return this.http.put<Event>(`${environment.apiUrl}/events/${event.id}`, event);
  }

  /**
   * Create event form
   */
  createEventForm(event?: Event): FormGroup {
    return this.fb.group({
      title: [event?.title || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: [event?.description || '', [Validators.minLength(2), Validators.maxLength(200)]],
      sport: [event?.sport || '', Validators.required],
      homeTeam: [event?.homeTeam || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      awayTeam: [event?.awayTeam || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      startTime: [this.dateUtility.formatDateForInput(event?.startTime) || '', Validators.required],
      status: [event?.status || '', Validators.required],
      odds: this.fb.group({
        home: [event?.odds?.home || null, [Validators.required, Validators.min(1.01), Validators.max(100)]],
        away: [event?.odds?.away || null, [Validators.required, Validators.min(1.01), Validators.max(100)]],
        draw: [event?.odds?.draw || null, [Validators.min(1.01), Validators.max(100)]]
      })
    });
  }
}
