import { inject, Injectable } from "@angular/core";
import { Bet } from "../models/bet.model";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BetsService {
    private readonly http = inject(HttpClient);

    addBet(bet: Bet): Observable<Bet> {
        return this.http.post<Bet>(`${environment.apiUrl}/bets`, bet);
    }

    getAllBets(): Observable<Bet[]> {
        return this.http.get<Bet[]>(`${environment.apiUrl}/bets`);
    }

    getBetById(id: string): Observable<Bet> {
        return this.http.get<Bet>(`${environment.apiUrl}/bets/${id}`);
    }

    deleteBet(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/bets/${id}`);
    }

    // LocalStorage methods for betslip persistence (temporary selected bets)
    saveBetslipToLocalStorage(bets: Bet[]): void {
        localStorage.setItem('betslip', JSON.stringify(bets));
    }

    getBetslipFromLocalStorage(): Bet[] {
        const stored = localStorage.getItem('betslip');
        return stored ? JSON.parse(stored) : [];
    }

    clearBetslipFromLocalStorage(): void {
        localStorage.removeItem('betslip');
    }

    // Utility method to save bet to both database and localStorage
    saveBetWithFallback(bet: Bet): Observable<Bet> {
        return this.addBet(bet).pipe(
            tap(savedBet => {
                const existingBets = this.getBetslipFromLocalStorage();
                this.saveBetslipToLocalStorage([...existingBets, savedBet]);
            }),
            catchError(error => {
                console.error('Database save failed, saving to localStorage only:', error);
                const existingBets = this.getBetslipFromLocalStorage();
                this.saveBetslipToLocalStorage([...existingBets, bet]);
                return of(bet);
            })
        );
    }
}