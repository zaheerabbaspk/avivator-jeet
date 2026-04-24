import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { remove, add } from 'ionicons/icons';
import { Bet } from '../../../models/crash-game.model';

@Component({
  selector: 'app-aviator-bet-controls',
  templateUrl: './aviator-bet-controls.component.html',
  styleUrls: ['./aviator-bet-controls.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon]
})
export class AviatorBetControlsComponent {
  @Input() slot: 'A' | 'B' = 'A';
  @Input() betData!: Bet;
  @Input() gameState: string = 'WAITING';
  @Input() currentMultiplier: number = 1.0;
  
  @Output() onPlaceBet = new EventEmitter<{ amount: number, autoCashout?: number | null }>();
  @Output() onCashOut = new EventEmitter<void>();
  @Output() onCancelBet = new EventEmitter<void>();
  @Output() onAmountChange = new EventEmitter<number>();
  @Output() onModeChange = new EventEmitter<'manual' | 'auto'>();
  @Output() onAutoBetToggle = new EventEmitter<boolean>();
  @Output() onAutoCashoutToggle = new EventEmitter<boolean>();
  @Output() onAutoCashoutValueChange = new EventEmitter<number>();

  mode = signal<'manual' | 'auto'>('manual');
  betAmount = signal<number>(16);
  
  autoBet = signal<boolean>(false);
  useAutoCashout = signal<boolean>(false);
  autoCashoutValue = signal<number>(1.1);


  constructor() {
    addIcons({ remove, add });

    // Sync state changes to parent
    effect(() => this.onAmountChange.emit(this.betAmount()));
    effect(() => this.onModeChange.emit(this.mode()));
    effect(() => this.onAutoBetToggle.emit(this.autoBet()));
    effect(() => this.onAutoCashoutToggle.emit(this.useAutoCashout()));
    effect(() => this.onAutoCashoutValueChange.emit(this.autoCashoutValue()));
  }


  lastQuickButton: number | null = null;

  adjustBetQuick(val: number) {
    if (this.gameState !== 'WAITING') return;

    if (this.lastQuickButton === val || this.betAmount() === val) {
      this.betAmount.update(v => v + val);
    } else {
      this.betAmount.set(val);
    }
    this.lastQuickButton = val;
  }

  adjustBet(val: number, type: 'add' | 'set') {
    if (this.gameState !== 'WAITING') return;
    this.lastQuickButton = null; // Reset on manual adjustment
    if (type === 'set') {
      this.betAmount.set(val);
    } else {
      this.betAmount.update(v => Math.max(16, v + val));
    }
  }

  handleAction() {
    if (this.betData.status === 'IDLE') {
      this.onPlaceBet.emit({
        amount: this.betAmount(),
        autoCashout: this.useAutoCashout() ? this.autoCashoutValue() : null
      });
    } else if (this.betData.status === 'PLACED' && this.gameState === 'RUNNING') {
      this.onCashOut.emit();
    } else if (this.betData.status === 'PLACED' && this.gameState === 'WAITING') {
      this.onCancelBet.emit();
    }
  }
}
