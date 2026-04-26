import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, refreshOutline } from 'ionicons/icons';

interface RechargeTask {
  id: number;
  minDeposit: number;
  minReward: number;
  maxReward: number;
  currentProgress: number;
}

@Component({
  selector: 'app-first-deposit-reward-modal',
  templateUrl: './first-deposit-reward-modal.component.html',
  styleUrls: ['./first-deposit-reward-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonModal, IonIcon]
})
export class FirstDepositRewardModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() deposit = new EventEmitter<number>();

  tasks: RechargeTask[] = [
    { id: 1, minDeposit: 200, minReward: 7, maxReward: 77, currentProgress: 0 },
    { id: 2, minDeposit: 1000, minReward: 37, maxReward: 777, currentProgress: 0 },
    { id: 3, minDeposit: 3000, minReward: 77, maxReward: 3777, currentProgress: 0 },
    { id: 4, minDeposit: 10000, minReward: 177, maxReward: 7777, currentProgress: 0 },
    { id: 5, minDeposit: 3000, minReward: 377, maxReward: 17777, currentProgress: 0 }, // Corrected 30k from screenshot
    { id: 6, minDeposit: 50000, minReward: 777, maxReward: 37777, currentProgress: 0 }
  ];

  constructor() {
    addIcons({ close, refreshOutline });
  }

  dismiss() {
    this.close.emit();
  }

  handleDeposit(minDeposit: number) {
    this.deposit.emit(minDeposit);
    this.dismiss();
  }
}
