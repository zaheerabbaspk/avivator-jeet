import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon, IonButton, IonCheckbox, IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  refreshOutline, 
  closeCircleOutline, 
  walletOutline, 
  cashOutline, 
  chevronForwardOutline,
  closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-reward-modal',
  templateUrl: './reward-modal.component.html',
  styleUrls: ['./reward-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonModal, IonIcon, IonButton, IonCheckbox, FormsModule]
})
export class RewardModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() depositClick = new EventEmitter<number>();

  rewards = [
    { target: 100, reward: 50.00, progress: 0 },
    { target: 300, reward: 57.00, progress: 0 },
    { target: 500, reward: 77.00, progress: 0 },
    { target: 1000, reward: 117.00, progress: 0 },
    { target: 3000, reward: 177.00, progress: 0 },
    { target: 10000, reward: 477.00, progress: 0 },
    { target: 50000, reward: 2777.00, progress: 0 },
  ];

  dontShowToday = false;
  neverRemind = false;

  constructor() {
    addIcons({ 
      refreshOutline, 
      closeCircleOutline, 
      walletOutline, 
      cashOutline, 
      chevronForwardOutline,
      closeOutline
    });
  }

  ngOnInit() {
    // Check local storage for preferences if needed
  }

  dismiss() {
    if (this.dontShowToday) {
      const today = new Date().toDateString();
      localStorage.setItem('hideRewardModalDate', today);
    }
    if (this.neverRemind) {
      localStorage.setItem('hideRewardModalPermanently', 'true');
    }
    this.close.emit();
  }

  onDeposit(amount: number) {
    this.depositClick.emit(amount);
    this.dismiss();
  }
}
