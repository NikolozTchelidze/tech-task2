export interface Event {
  id: string; // უნიკალური
  title: string; // მინ-2 მაქს-100 სიმბოლო
  description: string; // მინ-2 მაქს-200 სიმბოლო
  sport: 'football' | 'basketball' | 'tennis' | 'volleyball'; // სპორტის ტიპი
  homeTeam: string; // მინ-2 მაქს-50 სიმბოლო
  awayTeam: string; // მინ-2 მაქს-50 სიმბოლო
  startTime: Date; // ღონისძიების დროი
  status: 'upcoming' | 'live' | 'finished'; // სტატუსი
  odds: {
    home: number; // მინ-1.01 მაქს-100
    draw?: number; // არასავალდებულო (ზოგიერთ სპორტში არ არის ფრე)
    away: number; // მინ-1.01 მაქს-100
  };
  isLive: boolean;
}

export type EventStatus = 'upcoming' | 'live' | 'finished';
export type SportType = 'football' | 'basketball' | 'tennis' | 'volleyball';
export type BetOutcome = 'home' | 'away' | 'draw';
