import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonRippleEffect } from '@ionic/angular/standalone';
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
  chevronUpOutline
} from 'ionicons/icons';

interface DepositAmount {
  val: number;
  bonus: string;
}

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonRippleEffect, FooterNavComponent]

})
export class DepositPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
      chevronUpOutline
    });
  }

  ngOnInit() {
    this.startTimer();

    // Check for incoming deposit amount from reward modal
    this.route.queryParams.subscribe(params => {
      const amount = params['amount'];
      if (amount) {
        this.selectAmount(Number(amount));
      }
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    // Simulated countdown timer logic
    this.timerInterval = setInterval(() => {
      // In a real app, this would decrement from a server timestamp
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

  goBack() {
    this.router.navigate(['/home']);
  }

  get canDeposit() {
    const finalAmount = this.selectedAmount || parseInt(this.customAmount);
    return finalAmount && finalAmount >= 100 && this.walletNumber.length >= 11;
  }

  submitDeposit() {
    if (this.canDeposit) {
      // Logic for deposit
      console.log('Depositing...', { method: this.selectedMethod, amount: this.selectedAmount || this.customAmount, wallet: this.walletNumber });
      
      // Navigate to offers page and trigger treasure modal
      this.router.navigate(['/offers'], { queryParams: { showTreasure: 'true' } });
    }
  }
}
