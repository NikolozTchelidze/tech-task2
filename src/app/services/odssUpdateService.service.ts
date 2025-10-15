import { Injectable, inject } from "@angular/core";
import { Observable, timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { EventsService } from "./events.service";

@Injectable({
  providedIn: 'root'
})
export class OddsUpdateService {
  private eventsService = inject(EventsService);
  
  startOddsSimulation(): Observable<any> {
    return timer(0, 4000).pipe( // ყოველ 4 წამში
      switchMap(() => this.eventsService.loadEvents().pipe(
        map(events => {
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          return {
            eventId: randomEvent.id,
            newOdds: this.generateRandomOdds(randomEvent.sport)
          };
        })
      ))
    );
  }
  
  private generateRandomOdds(sport?: string) {
    const baseOdds = {
      home: +(Math.random() * 3 + 1).toFixed(2), // 1.00-დან 4.00-მდე
      away: +(Math.random() * 3 + 1).toFixed(2) // 1.00-დან 4.00-მდე
    };

    // Only add draw odds for football/soccer
    if (sport === 'football') {
      return {
        ...baseOdds,
        draw: +(Math.random() * 2 + 2.5).toFixed(2) // 2.50-დან 4.50-მდე
      };
    }

    return baseOdds;
  }
}
