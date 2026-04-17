import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircleOutline, gift, giftOutline, downloadOutline, walletOutline, chevronForwardOutline } from 'ionicons/icons';
import { inject } from '@angular/core';
import { RewardService, RegistrationReward } from '../../services/reward.service';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonModal, IonIcon, IonButton]
})
export class SuccessModalComponent {
  private rewardService = inject(RewardService);
  
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() deposit = new EventEmitter<void>();

  rewards: RegistrationReward[] = [];

  constructor() {
    addIcons({ checkmarkCircle, closeCircleOutline, gift, giftOutline, downloadOutline, walletOutline, chevronForwardOutline });
    this.rewards = this.rewardService.getRegistrationRewards();
  }

  dismiss() {
    this.close.emit();
  }

  onDeposit() {
    this.deposit.emit();
    this.dismiss();
  }
}
