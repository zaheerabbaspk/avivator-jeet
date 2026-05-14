import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardBetSocketService {
  private socket: Socket;

  // Signals for components to listen to
  gameState = signal<string>('FINISHED');
  timeLeft = signal<number>(0);
  gameResult = signal<any>(null);

  constructor() {
    this.socket = io(environment.backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on('cardBet_StateUpdate', (data: any) => {
      this.gameState.set(data.state);
      this.timeLeft.set(data.timeLeft);
    });

    this.socket.on('cardBet_Result', (data: any) => {
      this.gameResult.set(data);
      this.gameState.set('REVEALING');
    });
  }

  placeBet(betData: any) {
    this.socket.emit('cardBet_PlaceBet', betData);
  }
}
