import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

export type GameState = 'WAITING' | 'RUNNING' | 'CRASHED';

export interface GameStateUpdate {
    state: GameState;
    timeLeft?: number;
    roundId?: string;
}

export interface MultiplierUpdate {
    multiplier: number;
}

export interface CrashEvent {
    crashMultiplier: number;
    roundId: string;
}

export interface PlaceBetData {
    slot: 'A' | 'B';
    amount: number;
    autoCashout?: number | null;
}

export interface CashoutData {
    slot: 'A' | 'B';
}

@Injectable({
    providedIn: 'root'
})
export class CrashGameSocketService {
    private socket: Socket | null = null;

    // Connection state signals
    connected = signal<boolean>(false);
    connectionError = signal<string | null>(null);

    // Game state signals
    gameState = signal<GameState>('WAITING');
    currentMultiplier = signal<number>(1.00);
    crashMultiplier = signal<number>(0);
    timeLeft = signal<number>(0);
    roundId = signal<string>('');

    constructor() {
        this.connect();
    }

    private connect() {
        try {
            this.socket = io(environment.backendUrl, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            });

            this.setupEventListeners();
        } catch (error) {
            console.error('Socket connection error:', error);
            this.connectionError.set('Failed to connect to server');
        }
    }

    private localTimer: any;

    private setupEventListeners() {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            console.log('✅ Connected to game server');
            this.connected.set(true);
            this.connectionError.set(null);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from game server');
            this.connected.set(false);
            if (this.localTimer) clearInterval(this.localTimer);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.connected.set(false);
            this.connectionError.set('Unable to connect to server');
            if (this.localTimer) clearInterval(this.localTimer);
        });

        // Game events
        this.socket.on('gameStateUpdate', (data: GameStateUpdate) => {
            console.log('📡 Game state update:', data);
            this.gameState.set(data.state);
            
            if (this.localTimer) {
                clearInterval(this.localTimer);
                this.localTimer = null;
            }

            if (data.timeLeft !== undefined) {
                this.timeLeft.set(data.timeLeft);
                if (data.state === 'WAITING' && data.timeLeft > 0) {
                    // Start local countdown for smooth UI progress bar
                    this.localTimer = setInterval(() => {
                        this.timeLeft.update(t => {
                            const next = t - 0.1;
                            if (next <= 0) {
                                clearInterval(this.localTimer);
                                this.localTimer = null;
                                return 0;
                            }
                            return next;
                        });
                    }, 100);
                }
            }
            if (data.roundId) {
                this.roundId.set(data.roundId);
            }
        });

        this.socket.on('multiplierUpdate', (data: MultiplierUpdate) => {
            this.currentMultiplier.set(data.multiplier);
        });

        this.socket.on('crashEvent', (data: CrashEvent) => {
            console.log('💥 Crash event:', data);
            this.crashMultiplier.set(data.crashMultiplier);
            this.gameState.set('CRASHED');
        });

        // Request initial state when connected
        this.socket.on('connect', () => {
            this.socket?.emit('requestGameState');
        });
    }

    // Actions to send to server
    placeBet(data: PlaceBetData) {
        if (!this.socket || !this.connected()) {
            console.error('Cannot place bet: not connected to server');
            return;
        }

        console.log('🎲 Placing bet:', data);
        this.socket.emit('placeBet', data);
    }

    cashout(data: CashoutData) {
        if (!this.socket || !this.connected()) {
            console.error('Cannot cashout: not connected to server');
            return;
        }

        console.log('💰 Cashing out:', data);
        this.socket.emit('cashout', data);
    }

    cancelBet(data: { slot: 'A' | 'B' }) {
        if (!this.socket || !this.connected()) {
            console.error('Cannot cancel bet: not connected to server');
            return;
        }

        console.log('🚫 Cancelling bet:', data);
        this.socket.emit('cancelBet', data);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected.set(false);
        }
    }

    reconnect() {
        this.disconnect();
        this.connect();
    }
}
