import { Routes } from '@angular/router';
import { EventsList } from './pages/events-list/events-list';
import { EventDetails } from './pages/event-details/event-details';
import { CreateEvent } from './pages/create-event/create-event';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventsList },
  { path: 'events/add', component: CreateEvent }, 
  { path: 'events/:id', component: EventDetails },
  { path: '**', redirectTo: '/events' }
];
