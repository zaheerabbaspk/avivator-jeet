import { Injectable, signal, inject, OnDestroy } from '@angular/core';
import { Bet } from '../models/crash-game.model';
import { CrashGameSocketService, GameState } from './crash-game-socket.service';

@Injectable({
    providedIn: 'root'
})
export class CrashGameEngineService implements OnDestroy {
    private socketService = inject(CrashGameSocketService);

    // UI State Signals (managed locally)
    balance = signal<number>(10000); // Initial virtual balance
    history = signal<number[]>([]);

    // Betting Signals (local UI state)
    betSlotA = signal<Bet>({ id: 'A', slot: 'A', amount: 0, status: 'IDLE' });
    betSlotB = signal<Bet>({ id: 'B', slot: 'B', amount: 0, status: 'IDLE' });

    // Game State (from server via WebSocket)
    gameState = this.socketService.gameState;
    currentMultiplier = this.socketService.currentMultiplier;
    timeLeft = this.socketService.timeLeft;
    connected = this.socketService.connected;
    connectionError = this.socketService.connectionError;

    constructor() {
        // Subscribe to game state changes from server
        this.setupServerEventHandlers();
    }

    ngOnDestroy() {
        this.socketService.disconnect();
    }

    private setupServerEventHandlers() {
        // Listen for crash events to update history
        // Note: In a signal-based approach, we can use an effect or manual subscription
        // For now, we'll update manually when needed
    }

    // --- Betting Actions (send to server) ---

    placeBet(slot: 'A' | 'B', amount: number, autoCashout?: number | null) {
        // Validate state
        if (this.gameState() !== 'WAITING') {
            console.warn('Cannot place bet: game is not in WAITING state');
            return;
        }

        if (amount > this.balance()) {
            console.warn('Cannot place bet: insufficient balance');
            return;
        }

        if (!this.connected()) {
            console.error('Cannot place bet: not connected to server');
            return;
        }

        const betSignal = slot === 'A' ? this.betSlotA : this.betSlotB;

        // Check if already placed
        if (betSignal().status !== 'IDLE') {
            console.warn('Bet already placed for this slot');
            return;
        }

        // Update local UI state
        betSignal.set({
            id: slot,
            slot,
            amount,
            status: 'PLACED',
            autoCashout
        });

        // Deduct from balance
        this.balance.update(b => b - amount);

        // Send to server
        this.socketService.placeBet({
            slot,
            amount,
            autoCashout
        });
    }

    cashOut(slot: 'A' | 'B') {
        // Validate state
        if (this.gameState() !== 'RUNNING') {
            console.warn('Cannot cashout: game is not running');
            return;
        }

        if (!this.connected()) {
            console.error('Cannot cashout: not connected to server');
            return;
        }

        const betSignal = slot === 'A' ? this.betSlotA : this.betSlotB;
        const bet = betSignal();

        if (bet.status !== 'PLACED') {
            console.warn('No active bet to cashout');
            return;
        }

        // Calculate payout
        const multiplier = this.currentMultiplier();
        const payout = bet.amount * multiplier;

        // Update local state
        betSignal.set({
            ...bet,
            status: 'CASHED_OUT',
            cashoutMultiplier: multiplier,
            payout
        });

        // Add to balance
        this.balance.update(b => b + payout);

        // Send to server
        this.socketService.cashout({ slot });
    }

    // --- Helper Methods ---

    /**
     * Called when a new round starts (WAITING state)
     * Resets bet slots if they were not carried over
     */
    resetBetsIfNeeded() {
        this.betSlotA.update(b =>
            b.status === 'PLACED' ? b : { ...b, amount: 0, status: 'IDLE', payout: 0, cashoutMultiplier: undefined }
        );
        this.betSlotB.update(b =>
            b.status === 'PLACED' ? b : { ...b, amount: 0, status: 'IDLE', payout: 0, cashoutMultiplier: undefined }
        );
    }

    /**
     * Called when game crashes
     * Updates history and settles losing bets
     */
    handleCrash(crashMultiplier: number) {
        // Update history
        this.history.update(h => [crashMultiplier, ...h].slice(0, 20));

        // Settle losing bets
        [this.betSlotA, this.betSlotB].forEach(betSignal => {
            const bet = betSignal();
            if (bet.status === 'PLACED') {
                betSignal.update(b => ({ ...b, status: 'LOST', payout: 0 }));
            }
        });
    }

    /**
     * Reconnect to server
     */
    reconnect() {
        this.socketService.reconnect();
    }
}
