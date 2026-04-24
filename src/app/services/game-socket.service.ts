import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

export interface LiveBet {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  amount: number;
  status: 'active' | 'win' | 'lose';
  cashoutMultiplier?: number;
  winAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameSocketService {
  private socket: Socket;
  
  // Expose signals for Angular UI to consume directly
  public gameState = signal<'waiting' | 'running' | 'crashed'>('waiting');
  public currentMultiplier = signal<number>(1.00);
  public waitTimeLeft = signal<number>(5000);
  public allBets = signal<LiveBet[]>([]);
  public totalActiveBets = signal<number>(0);
  public totalWinAmount = signal<number>(0);

  constructor() {
    // Replace with your Supabase session token
    const token = localStorage.getItem('supabase.auth.token') || '';

    this.socket = io('http://localhost:3000', {
      auth: { token }
    });

    this.setupListeners();
  }

  private setupListeners() {
    // Initial connection sync
    this.socket.on('game:state', (data) => {
      this.gameState.set(data.gameState);
      this.currentMultiplier.set(data.currentMultiplier);
    });

    // Phase: WAITING
    this.socket.on('round:waiting', (data) => {
      this.gameState.set('waiting');
      this.currentMultiplier.set(1.00);
      this.allBets.set([]); // Clear bets from last round
      this.totalWinAmount.set(0);
      this.totalActiveBets.set(0);
      // Start a local timer for countdown if needed
    });

    // Phase: RUNNING
    this.socket.on('round:running', () => {
      this.gameState.set('running');
    });

    // Multiplier Ticks
    this.socket.on('multiplier:update', (data) => {
      this.currentMultiplier.set(data.multiplier);
    });

    // Phase: CRASHED
    this.socket.on('round:crashed', (data) => {
      this.gameState.set('crashed');
      this.currentMultiplier.set(data.multiplier);
      
      // Mark all remaining active bets as lost
      this.allBets.update(bets => bets.map(b => 
        b.status === 'active' ? { ...b, status: 'lose' } : b
      ));
    });

    // Live Bets Feed
    this.socket.on('bet:placed', (bet: LiveBet) => {
      this.allBets.update(bets => [bet, ...bets]);
      this.totalActiveBets.update(c => c + 1);
    });

    // Live Cashout Feed
    this.socket.on('bet:cashed_out', (data: { userId: string, winAmount: number, multiplier: number }) => {
      this.allBets.update(bets => {
        return bets.map(b => {
          if (b.userId === data.userId) {
            return { ...b, status: 'win', cashoutMultiplier: data.multiplier, winAmount: data.winAmount };
          }
          return b;
        });
      });
      this.totalWinAmount.update(total => total + data.winAmount);
    });
  }

  // Actions
  public placeBet(amount: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('bet:place', { amount }, (response: any) => {
        if (response.error) reject(response.error);
        else resolve(response);
      });
    });
  }

  public cashOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('bet:cashout', {}, (response: any) => {
        if (response.error) reject(response.error);
        else resolve(response);
      });
    });
  }
}
