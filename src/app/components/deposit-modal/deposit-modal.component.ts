import { Component, Input, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonRippleEffect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  headsetOutline, 
  documentTextOutline, 
  refreshOutline, 
  giftOutline, 
  timeOutline, 
  phonePortraitOutline,
  copyOutline,
  chevronDownOutline,
  chevronUpOutline,
  closeOutline
} from 'ionicons/icons';

interface DepositAmount {
  val: number;
  bonus: string;
}

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonModal, IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonRippleEffect]
})
export class DepositModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  selectedMethod = 'jazzcash';
  selectedAmount: number | null = null;
  customAmount: string = '';
  walletNumber: string = '';
  timer: string = '23:58:36.7';
  isPromotionsExpanded = false;

  amounts: DepositAmount[] = [
    { val: 100,    bonus: '+50.00' },
    { val: 500,    bonus: '+77.00' },
    { val: 1000,   bonus: '+124.00' },
    { val: 3000,   bonus: '+194.00' },
    { val: 5000,   bonus: '+214.00' },
    { val: 10000,  bonus: '+554.00' },
    { val: 30000,  bonus: '+754.00' },
    { val: 50000,  bonus: '+3,554.00' }
  ];

  promotions = [
    { label: 'Bonus 50.00', desc: 'First Deposit ≥ 100' },
    { label: 'Bonus 57.00', desc: 'First Deposit ≥ 300' },
    { label: 'Bonus 77.00', desc: 'First Deposit ≥ 500' }
  ];

  private timerInterval: any;

  constructor() {
    addIcons({ 
      chevronBackOutline, 
      headsetOutline, 
      documentTextOutline, 
      refreshOutline, 
      giftOutline, 
      timeOutline, 
      phonePortraitOutline,
      copyOutline,
      chevronDownOutline,
      chevronUpOutline,
      closeOutline
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      // Timer logic
    }, 1000);
  }

  selectAmount(amount: number) {
    this.selectedAmount = amount;
    this.customAmount = '';
  }

  onCustomAmountChange() {
    if (this.customAmount) {
      this.selectedAmount = null;
    }
  }

  async pasteNumber() {
    try {
      const text = await navigator.clipboard.readText();
      if (/^\d+$/.test(text)) {
        this.walletNumber = text;
      }
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  }

  dismiss() {
    this.close.emit();
  }

  get canDeposit() {
    const finalAmount = this.selectedAmount || parseInt(this.customAmount);
    return finalAmount && finalAmount >= 100 && this.walletNumber.length >= 11;
  }

  submitDeposit() {
    if (this.canDeposit) {
      console.log('Depositing...', { method: this.selectedMethod, amount: this.selectedAmount || this.customAmount, wallet: this.walletNumber });
      this.dismiss();
    }
  }
}
