import { Injectable, signal, inject, OnDestroy, effect, untracked } from '@angular/core';
import { Bet } from '../models/crash-game.model';
import { CrashGameSocketService, GameState } from './crash-game-socket.service';
import { AuthService } from './auth.service';

export interface ActiveBet {
    id: string;
    name: string;
    avatarClass: string;
    avatarLetter: string;
    betAmount: number;
    cashoutTarget: number;
    status: 'PLAYING' | 'CASHED_OUT' | 'LOST';
    winAmount?: number;
    cashoutMultiplier?: number;
    isMe?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CrashGameEngineService implements OnDestroy {
    private socketService = inject(CrashGameSocketService);

    // UI State Signals (managed locally)
    balance = signal<number>(0);
    history = this.socketService.history;

    // Betting Signals (local UI state)
    betSlotA = signal<Bet>({ id: 'A', slot: 'A', amount: 0, status: 'IDLE' });
    betSlotB = signal<Bet>({ id: 'B', slot: 'B', amount: 0, status: 'IDLE' });

    // Live Player Simulation Signals
    activeBets = signal<ActiveBet[]>([]);
    totalBetsCount = signal<number>(0);
    totalWinAmount = signal<number>(0);

    // Game State (from server via WebSocket)
    gameState = this.socketService.gameState;
    currentMultiplier = this.socketService.currentMultiplier;
    timeLeft = this.socketService.timeLeft;
    connected = this.socketService.connected;
    connectionError = this.socketService.connectionError;

    // Simulation Logic State (Internal)
    private _activeBets: ActiveBet[] = [];
    private syncTimer: any;

    private authService = inject(AuthService);

    constructor() {
        // Subscribe to global balance
        this.authService.balance$.subscribe((val: number) => {
            this.balance.set(val);
        });

        // Subscribe to game state changes from server
        this.setupServerEventHandlers();

        // Throttled UI Syncing (Runs every 200ms to keep UI fast but responsive)
        this.syncTimer = setInterval(() => {
            const state = this.gameState();
            if (state === 'RUNNING' || state === 'WAITING' || state === 'CRASHED') {
                // Only update signal if list changed (shallow check)
                this.activeBets.set([...this._activeBets]);
            }
        }, 200);

        // Simulation Effect (Handles bot logic, but writes to _activeBets internal buffer)
        effect(() => {
            const state = this.gameState();
            const multiplier = this.currentMultiplier();

            untracked(() => {
                if (state === 'WAITING' && this._activeBets.length > 0 && multiplier === 1.0) {
                    // Reset bots on new round
                    this.totalWinAmount.set(0);
                    // We don't call generateBots() here anymore if we want REAL logic.
                    // Instead, we let the server or the initial list handle it.
                    // But if we want bots, we call it once per round.
                    this.generateBots();
                } else if (state === 'RUNNING') {
                    // Check if bots hit cashout targets (Update internal buffer first)
                    let updated = false;
                    let newWins = 0;

                    for (const bet of this._activeBets) {
                        if (!bet.isMe && bet.status === 'PLAYING' && multiplier >= bet.cashoutTarget) {
                            const win = bet.betAmount * bet.cashoutTarget;
                            newWins += win;
                            bet.status = 'CASHED_OUT';
                            bet.cashoutMultiplier = bet.cashoutTarget;
                            bet.winAmount = win;
                            updated = true;
                        }
                    }

                    if (updated) {
                        this.totalWinAmount.update(w => w + newWins);
                    }

                    // MY AUTO CASHOUT LOGIC
                    [this.betSlotA, this.betSlotB].forEach(betSignal => {
                        const bet = betSignal();
                        if (bet.status === 'PLACED' && bet.autoCashout && multiplier >= bet.autoCashout) {
                            this.cashOut(bet.slot as 'A' | 'B', bet.autoCashout);
                        }
                    });
                } else if (state === 'CRASHED' && multiplier > 1.0) {
                    // Mark all playing bots as lost
                    for (const bet of this._activeBets) {
                        if (bet.status === 'PLAYING') {
                            bet.status = 'LOST';
                        }
                    }
                }
            });
        }, { allowSignalWrites: true });

        // --- NEW REAL LOGIC SOCKET LISTENERS ---
        this.socketService.onEvent('bet:placed', (data: any) => {
            this.handleExternalBet(data);
        });

        this.socketService.onEvent('bet:cashed_out', (data: any) => {
            this.handleExternalCashout(data);
        });

        this.socketService.onEvent('bet:list', (data: any[]) => {
            this.handleExternalBetList(data);
        });
    }

    private handleExternalBet(data: any) {
        // Avoid adding ourselves twice (we already add ourselves locally for speed)
        const myUserId = this.authService.userSubject.value?.id;
        if (data.userId === myUserId) return;

        const bet: ActiveBet = {
            id: data.id || `ext_${data.userId}`,
            name: data.username || data.name || 'Anonymous',
            avatarClass: 'bg-gradient-to-br from-blue-500 to-indigo-500', // Default for real users
            avatarLetter: (data.username || 'A')[0].toUpperCase(),
            betAmount: data.amount,
            cashoutTarget: data.autoCashout || 9999,
            status: 'PLAYING'
        };

        this._activeBets.unshift(bet);
        this.totalBetsCount.update(c => c + 1);
    }

    private handleExternalCashout(data: any) {
        const myUserId = this.authService.userSubject.value?.id;
        if (data.userId === myUserId) return;

        for (const bet of this._activeBets) {
            if (bet.id === data.id || bet.id === `ext_${data.userId}`) {
                bet.status = 'CASHED_OUT';
                bet.winAmount = data.winAmount;
                bet.cashoutMultiplier = data.multiplier;
                this.totalWinAmount.update(w => w + data.winAmount);
                break;
            }
        }
    }

    private handleExternalBetList(list: any[]) {
        // Sync full list (useful on reconnect)
        const myUserId = this.authService.userSubject.value?.id;
        const filteredList = list.filter(item => item.userId !== myUserId).map(item => ({
            id: item.id || `ext_${item.userId}`,
            name: item.username || item.name || 'Anonymous',
            avatarClass: 'bg-gradient-to-br from-blue-500 to-indigo-500',
            avatarLetter: (item.username || 'A')[0].toUpperCase(),
            betAmount: item.amount,
            cashoutTarget: item.autoCashout || 9999,
            status: item.status === 'win' ? 'CASHED_OUT' : (item.status === 'lose' ? 'LOST' : 'PLAYING'),
            winAmount: item.winAmount,
            cashoutMultiplier: item.cashoutMultiplier
        } as ActiveBet));

        // Keep our own bets if present
        const myBets = this._activeBets.filter(b => b.isMe);
        this._activeBets = [...myBets, ...filteredList];
        this.totalBetsCount.set(this._activeBets.length);
    }

    private generateBots() {
        const numBots = Math.floor(Math.random() * 100) + 100; // 100-200 bots per round exactly
        const gradients = [
            'from-pink-500 to-purple-500',
            'from-orange-500 to-yellow-500',
            'from-green-500 to-emerald-500',
            'from-blue-500 to-indigo-500',
            'from-red-500 to-pink-500',
            'from-yellow-400 to-orange-500',
            'from-teal-400 to-emerald-500'
        ];

        const bots: ActiveBet[] = Array.from({ length: numBots }).map((_, i) => {
            const betAmt = Math.floor(Math.random() * 9900) + 100; // 100 to 10,000
            // Highly weight early cashouts
            const rand = Math.random();
            let target = 1.01;
            if (rand > 0.95) target = Math.random() * 10 + 2;
            else if (rand > 0.8) target = Math.random() * 2 + 1.5;
            else target = Math.random() * 0.5 + 1.05;

            const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            return {
                id: `bot_${i}`,
                name: `${Math.floor(Math.random() * 9)}***${Math.floor(Math.random() * 9)}`,
                avatarClass: `bg-gradient-to-br ${gradients[Math.floor(Math.random() * gradients.length)]}`,
                avatarLetter: letter,
                betAmount: betAmt,
                cashoutTarget: parseFloat(target.toFixed(2)),
                status: 'PLAYING'
            };
        });

        // Add my own placed bets if any carried over
        const myA = this.betSlotA();
        const myB = this.betSlotB();
        if (myA.status === 'PLACED') {
            bots.unshift({
                id: 'my_slot_A', name: 'You', avatarClass: 'bg-green-600', avatarLetter: 'U',
                betAmount: myA.amount, cashoutTarget: myA.autoCashout || 9999, status: 'PLAYING', isMe: true
            });
        }
        if (myB.status === 'PLACED') {
            bots.unshift({
                id: 'my_slot_B', name: 'You', avatarClass: 'bg-green-600', avatarLetter: 'U',
                betAmount: myB.amount, cashoutTarget: myB.autoCashout || 9999, status: 'PLAYING', isMe: true
            });
        }

        this._activeBets = bots;
        this.totalBetsCount.set(bots.length); // Exactly the dynamic bots
        this.activeBets.set([...this._activeBets]); // Direct update on heavy event
    }

    ngOnDestroy() {
        if (this.syncTimer) clearInterval(this.syncTimer);
        this.socketService.disconnect();
    }

    private setupServerEventHandlers() {
        // Listen for crash events to update history
        // Note: In a signal-based approach, we can use an effect or manual subscription
        // For now, we'll update manually when needed
    }

    // --- Betting Actions (send to server) ---

    async placeBet(slot: 'A' | 'B', amount: number, autoCashout?: number | null) {
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

        try {
            // Deduct from universal balance in database
            await this.authService.updateBalance(-amount);

            // Send to server
            this.socketService.placeBet({
                slot,
                amount,
                autoCashout
            });

            // Inject my bet into the simulated list (Internal buffer)
            const myBet: ActiveBet = {
                id: `my_slot_${slot}`,
                name: 'You',
                avatarClass: 'bg-[#3fb93f]',
                avatarLetter: 'U',
                betAmount: amount,
                cashoutTarget: autoCashout || 9999,
                status: 'PLAYING',
                isMe: true
            };
            this._activeBets.unshift(myBet);
            this.activeBets.set([...this._activeBets]); // Sync for immediate user feedback
            this.totalBetsCount.update(c => c + 1);
        } catch (error) {
            console.error('Failed to update balance during bet placement', error);
            // Revert state if failed
            betSignal.set({ ...betSignal(), status: 'IDLE' });
        }
    }

    async cashOut(slot: 'A' | 'B', targetMultiplier?: number | null) {
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
        const multiplier = targetMultiplier || this.currentMultiplier();
        const payout = parseFloat((bet.amount * multiplier).toFixed(2));

        // Update local state temporarily to avoid double tapping
        betSignal.set({
            ...bet,
            status: 'CASHED_OUT',
            cashoutMultiplier: multiplier,
            payout
        });

        try {
            // Add to universal balance in DB
            await this.authService.updateBalance(payout);

            // Send to server
            this.socketService.cashout({ slot });

            // Update my bet in the simulated list (Internal buffer)
            for (const b of this._activeBets) {
                if (b.id === `my_slot_${slot}`) {
                    b.status = 'CASHED_OUT';
                    b.winAmount = payout;
                    b.cashoutMultiplier = multiplier;
                    break;
                }
            }
            this.activeBets.set([...this._activeBets]); // Immediate sync for user feedback
            this.totalWinAmount.update(w => w + payout);
        } catch (error) {
            console.error('Failed to update balance during cashout', error);
        }
    }

    async cancelBet(slot: 'A' | 'B') {
        const betSignal = slot === 'A' ? this.betSlotA : this.betSlotB;
        const bet = betSignal();

        if (this.gameState() !== 'WAITING') {
            console.warn('Cannot cancel bet: game has already started or crashed');
            return;
        }

        if (bet.status !== 'PLACED') {
            console.warn('No active bet to cancel');
            return;
        }

        const refundAmount = bet.amount;

        try {
            // Refund balance in DB
            await this.authService.updateBalance(refundAmount);

            // Notify server
            this.socketService.cancelBet({ slot });

            // Update local state
            betSignal.set({
                id: slot,
                slot,
                amount: 0,
                status: 'IDLE'
            });

            // Remove my bet from simulated list (Internal buffer)
            this._activeBets = this._activeBets.filter(b => b.id !== `my_slot_${slot}`);
            this.activeBets.set([...this._activeBets]);
            this.totalBetsCount.update(c => Math.max(0, c - 1));

            console.log(`✅ Bet on slot ${slot} cancelled and refunded: ${refundAmount}`);
        } catch (error) {
            console.error('Failed to refund balance during bet cancellation', error);
        }
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

        // Generate bots
        this.totalWinAmount.set(0);
        this.generateBots();
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
