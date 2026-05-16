import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, close, help, helpCircleOutline } from 'ionicons/icons';
import { PlayingCardComponent } from '../../components/playing-card/playing-card.component';
import { decideCondition, rankToScore } from '../../utils/casino-condition.util';
import { CardBetSocketService } from '../../services/card-bet-socket.service';
import { effect } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  rank: number;
}

interface Hand {
  id: string;
  name: string;
  cards: Card[];
  total: number;
  backOdds: number;
  layOdds: number;
  backVolume: number;
  layVolume: number;
  profit: number;
  isWinner?: boolean;
  revealed: boolean;
  extraRevealed: boolean;
  highlight: boolean;
  cardRevealStates: boolean[];
}

@Component({
  selector: 'app-card-bet',
  templateUrl: './card-bet.page.html',
  styleUrls: ['./card-bet.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PlayingCardComponent]
})
export class CardBetPage implements OnInit, OnDestroy {
  hands: Hand[] = [];
  balance = 0;
  timeLeft = 0;
  private balanceSub: Subscription | null = null;
  currentBet = 1000;
  betType: 'back' | 'lay' | null = null;
  selectedHandIndex: number | null = null;
  gameInProgress = false;
  placedBets: { handIndex: number, type: 'back' | 'lay', stake: number, payout: number, profit: number }[] = [];
  maxBetsPerRound = 2;
  isLoading = true; // NEW: Loading state

  // Sequence Control
  private nextRoundTimeout: any;
  private localTimerInterval: any;
  private pendingResult: any = null;
  private lastProcessedRoundId: string | null = null;
  private revealInProgress = false;
  private revealTimeouts: any[] = [];
  private suits: ('hearts' | 'diamonds' | 'clubs' | 'spades')[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  private values = ['6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Exit Modal State
  isExitModalOpen = false;
  private authSvc = inject(AuthService);

  // History
  roundHistory: { winner: string, label: string }[] = [];
  suspendedText = 'SUSPENDED !';
  constructor(private router: Router, private cbSocket: CardBetSocketService) {
    addIcons({ arrowBack, help, close, helpCircleOutline });

    effect(() => {
      const state = this.cbSocket.gameState();
      const result = this.cbSocket.gameResult();
      const serverTime = this.cbSocket.timeLeft();

      // Sync Timer with Server (Only during betting/active phases)
      if (state !== 'WAITING' && serverTime >= 0) {
        this.timeLeft = serverTime;
        // If server is sending time, we stop our local interval to avoid fighting
        if (serverTime > 0) {
          clearInterval(this.localTimerInterval);
        }
      }

      if (state === 'REVEALING' && result && result.roundId !== this.lastProcessedRoundId) {
        if (this.timeLeft > 0) {
          this.pendingResult = result;
        } else {
          this.applyServerResult(result);
        }
      }

      // If server moves to WAITING, reset for next round
      if (state === 'WAITING') {
        this.pendingResult = null;
      }
    });
  }

  async ngOnInit() {
    this.startNewRound();
    this.balanceSub = this.authSvc.balance$.subscribe(bal => {
      this.balance = bal;
    });

    // Fetch initial history from Supabase
    await this.fetchGameHistory();

    // Simulate loading for 6 seconds
    setTimeout(() => {
      this.isLoading = false;
    }, 6000);
  }

  async fetchGameHistory() {
    try {
      const { data, error } = await this.authSvc.supabase
        .from('card_bet_history')
        .select('winner')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        this.roundHistory = data.map(item => ({
          winner: item.winner,
          label: item.winner
        }));
      }
    } catch (error) {
      console.error('Error fetching game history:', error);
    }
  }

  async saveGameResult(winnerName: string) {
    try {
      const { error } = await this.authSvc.supabase
        .from('card_bet_history')
        .insert([{ winner: winnerName, created_at: new Date() }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  }

  ngOnDestroy() {
    if (this.balanceSub) this.balanceSub.unsubscribe();
    this.stopSequence();
  }

  goBack() { this.isExitModalOpen = true; }
  cancelExit() { this.isExitModalOpen = false; }
  confirmExit() {
    this.isExitModalOpen = false;
    this.router.navigate(['/home']);
  }

  startNewRound() {
    this.stopSequence();
    clearInterval(this.localTimerInterval);
    this.gameInProgress = false;
    this.placedBets = [];
    this.didUserWin = false;

    const handNames = ['8', '9', '10', '11'];
    const handIds = ['hand1', 'hand2', 'hand3', 'hand4'];
    this.hands = [];

    const initialOdds = [
      { back: 12.2, lay: 13.7 },
      { back: 5.95, lay: 6.45 },
      { back: 3.2, lay: 3.45 },
      { back: 2.08, lay: 2.18 }
    ];

    for (let i = 0; i < 4; i++) {
      this.hands.push({
        id: handIds[i],
        name: handNames[i],
        cards: [],
        total: 0,
        backOdds: initialOdds[i].back,
        layOdds: initialOdds[i].lay,
        backVolume: 500000,
        layVolume: 500000,
        profit: 0,
        revealed: false,
        extraRevealed: false,
        highlight: false,
        cardRevealStates: []
      });
    }
  }

  stopSequence() {
    this.revealTimeouts.forEach(t => clearTimeout(t));
    this.revealTimeouts = [];
    this.revealInProgress = false;
  }

  addToHistory(winnerName: string) {
    this.roundHistory.unshift({ winner: winnerName, label: winnerName });
    if (this.roundHistory.length > 20) this.roundHistory.pop();
  }

  private getScore(val: string): number {
    if (val === 'K') return 13;
    if (val === 'Q') return 12;
    if (val === 'J') return 11;
    return parseInt(val) || 0;
  }

  applyServerResult(result: any) {
    if (!result || result.roundId === this.lastProcessedRoundId) return;
    this.lastProcessedRoundId = result.roundId;

    this.stopSequence();
    clearInterval(this.localTimerInterval);
    this.timeLeft = 0;
    this.gameInProgress = true;

    if (!this.hands || this.hands.length === 0) {
      this.startNewRound();
    }

    result.hands.forEach((serverHand: any, idx: number) => {
      if (this.hands[idx]) {
        this.hands[idx].cards = serverHand.cards || [];
        this.hands[idx].revealed = false;
        // Calculate initial total
        this.hands[idx].total = this.hands[idx].cards.reduce((sum, c) => sum + this.getScore(c.value), 0);
      }
    });

    this.runRevealSequence(result.winningHandId);
  }

  // --- Modal & Betting ---
  isModalOpen = false;
  didUserWin = false;
  modalHandIndex = 0;
  modalBetType: 'back' | 'lay' = 'back';
  modalStake = 20;
  private lastStake = 20;
  modalOdds = 1.0;

  openBetModal(handIndex: number, type: 'back' | 'lay') {
    if (this.gameInProgress || this.timeLeft === 0) return;
    if (this.placedBets.length >= this.maxBetsPerRound) {
      alert("Maximum 2 bets allowed per round");
      return;
    }
    this.modalHandIndex = handIndex;
    this.modalBetType = type;
    this.modalOdds = type === 'back' ? this.hands[handIndex].backOdds : this.hands[handIndex].layOdds;
    this.modalStake = this.lastStake;
    this.isModalOpen = true;
  }

  closeBetModal() { this.isModalOpen = false; }

  updateStake(amount: number, mode: 'set' | 'add') {
    if (mode === 'set') this.modalStake = amount;
    else this.modalStake += amount;
    if (this.modalStake < 0) this.modalStake = 0;
    this.lastStake = this.modalStake;
  }

  submitBet() {
    if (this.timeLeft === 0 || this.gameInProgress) {
      alert("Betting Suspended");
      this.closeBetModal();
      return;
    }
    let cost = this.modalStake;
    if (this.modalBetType === 'lay') {
      cost = Math.floor(this.modalStake * (this.modalOdds - 1));
    }
    if (this.balance < cost) {
      alert("Insufficient Balance");
      return;
    }

    // 1. Optimistic UI Update: Add bet immediately
    this.placedBets.push({
      handIndex: this.modalHandIndex,
      type: this.modalBetType,
      stake: this.modalStake,
      payout: 0,
      profit: 0
    });

    // 2. Close modal immediately
    this.closeBetModal();

    // 3. Update balance (now optimistic in service)
    this.authSvc.updateBalance(-cost).catch(err => {
      console.error("Bet submission error:", err);
      // Rollback logic could be added here if needed
    });
  }

  runRevealSequence(winningHandIndex: number) {
    this.revealInProgress = true;
    this.hands.forEach(h => {
      h.revealed = false;
      h.isWinner = false;
      h.highlight = false;
      (h as any).cardRevealStates = h.cards.map(() => false);
    });

    const stepDelay = 1000; // 1 second gap as requested

    // 1. Reveal FIRST card of all 4 hands
    this.hands.forEach((hand, i) => {
      const t = setTimeout(() => {
        if (this.hands[i]) {
          this.hands[i].cardRevealStates[0] = true;
          this.hands[i].revealed = true;
        }

        if (i === 3) {
          // 2. WAIT before checking for EXTRA cards (Suspense Phase)
          const t2 = setTimeout(() => this.revealExtraCards(winningHandIndex), 1000); // Reduced to 1s
          this.revealTimeouts.push(t2);
        }
      }, i * stepDelay);
      this.revealTimeouts.push(t);
    });
  }

  private revealExtraCards(winningHandIndex: number) {
    let maxExtraCards = Math.max(...this.hands.map(h => h.cards.length));
    if (maxExtraCards <= 1) {
      this.finalizeRound(winningHandIndex);
      return;
    }

    // Sequential reveal for extra cards to avoid suspicion
    let currentExtraIndex = 1;
    const revealNextSet = () => {
      if (currentExtraIndex >= maxExtraCards) {
        setTimeout(() => this.finalizeRound(winningHandIndex), 800);
        return;
      }

      // Get hands that actually need this extra card revealed
      const handsToReveal = this.hands.filter(h => h.cards.length > currentExtraIndex);

      handsToReveal.forEach((hand, i) => {
        const t = setTimeout(() => {
          (hand as any).cardRevealStates[currentExtraIndex] = true;

          // If this is the last hand in this set of extras
          if (i === handsToReveal.length - 1) {
            const nextT = setTimeout(() => {
              currentExtraIndex++;
              revealNextSet();
            }, 800); // Reduced to 0.8s
            this.revealTimeouts.push(nextT);
          }
        }, i * 300); // Reduced to 0.3 second gap
        this.revealTimeouts.push(t);
      });
    };

    revealNextSet();
  }

  finalizeRound(winnerIdx: number) {
    const winnerHand = this.hands[winnerIdx];
    winnerHand.isWinner = true;
    winnerHand.highlight = true;
    this.addToHistory(winnerHand.name);
    this.saveGameResult(winnerHand.name); // Persist to Supabase

    this.placedBets.forEach(bet => {
      const myHand = this.hands[bet.handIndex];
      const isMyHandWinner = bet.handIndex === winnerIdx;

      if (bet.type === 'back') {
        if (isMyHandWinner) {
          bet.profit = Math.floor(bet.stake * (myHand.backOdds - 1));
          this.authSvc.updateBalance(bet.stake + bet.profit);
        } else {
          bet.profit = -bet.stake;
        }
      } else {
        // Lay
        const liability = Math.floor(bet.stake * (myHand.layOdds - 1));
        if (!isMyHandWinner) {
          bet.profit = bet.stake;
          this.authSvc.updateBalance(bet.stake + liability);
        } else {
          bet.profit = -liability;
        }
      }
      myHand.profit = bet.profit;
    });

    const totalProfit = this.placedBets.reduce((sum, b) => sum + b.profit, 0);
    this.didUserWin = totalProfit > 0;

    // DYNAMIC SUSPENSION PHASE (Delay ROUND OVER by 1s)
    setTimeout(() => {
      this.suspendedText = 'ROUND OVER !';

      clearTimeout(this.nextRoundTimeout);
      this.nextRoundTimeout = setTimeout(() => {
        this.suspendedText = 'NEXT ROUND !';

        this.nextRoundTimeout = setTimeout(() => {
          this.startNewRound();
          this.startLocalTimer(15);
        }, 5000); // Reduced to 5s for NEXT ROUND

      }, 5000); // Reduced to 5s for ROUND OVER
    }, 1000);
  }

  private startLocalTimer(seconds: number) {
    clearInterval(this.localTimerInterval);
    this.timeLeft = seconds;
    this.localTimerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.localTimerInterval);
        this.suspendedText = 'SUSPENDED !';
        // If we have a buffered result, apply it now
        if (this.pendingResult) {
          this.applyServerResult(this.pendingResult);
          this.pendingResult = null;
        }
      }
    }, 1000);
  }

  getSuitSymbol(suit: string): string {
    const symbols: any = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    return symbols[suit] || '';
  }

  getSuitColor(suit: string): string {
    return (suit === 'hearts' || suit === 'diamonds') ? 'text-red-600' : 'text-black';
  }

  getHandStake(idx: number) {
    return this.placedBets.filter(b => b.handIndex === idx).reduce((s, b) => s + b.stake, 0);
  }
}
