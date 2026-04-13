import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonHeader, IonContent, IonFooter, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  headsetOutline,
  documentTextOutline,
  reloadOutline,
  giftOutline,
  chevronDownOutline,
  chevronUpOutline,
  logoWhatsapp
} from 'ionicons/icons';

interface DepositAmount {
  val: number;
  bonus: string;
}

interface Promotion {
  label: string;
  desc: string;
  highlight?: boolean;
  badge?: string;
  badgeDesc?: string;
}

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonContent, IonFooter, IonIcon, IonButton, FooterNavComponent]
})
export class DepositPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  selectedMethod = 'jazzcash';
  selectedAmount: number | null = null;
  customAmount: string = '';
  timer: string = '11:19:44.4';
  isPromotionsExpanded = false;
  userBalance = 1.55;

  // Amounts exactly matching the screenshot
  amounts: DepositAmount[] = [
    { val: 100,    bonus: '+1.50' },
    { val: 500,    bonus: '+861.50' },
    { val: 1000,   bonus: '+2,346.00' },
    { val: 3000,   bonus: '+7,376.00' },
    { val: 5000,   bonus: '+15,233.00' },
    { val: 10000,  bonus: '+19,358.00' },
    { val: 30000,  bonus: '+107,635.00' },
    { val: 50000,  bonus: '+305,912.00' },
  ];

  // Full promotions list matching screenshot (expanded view)
  promotions: Promotion[] = [
    { label: 'Rewards 7.00-77.00',        desc: 'First Deposit ≥ 200' },
    { label: 'Rewards 7.00-777.00',        desc: 'Single Deposit ≥ 500' },
    { label: 'Rewards 37.00-777.00',       desc: 'First Deposit ≥ 1,000' },
    {
      label: 'Rewards 7.00-777.00',
      desc: 'Total deposit ≥ 1,000',
      highlight: true,
      badge: 'Deposit again 1,000 to receive',
      badgeDesc: 'Total deposit ≥ 1,000'
    },
    { label: 'Rewards 17.00-2,777.00',     desc: 'Single Deposit ≥ 1,500' },
    { label: 'Rewards 77.00-3,777.00',     desc: 'First Deposit ≥ 3,000' },
    { label: 'Rewards 77.00-7,777.00',     desc: 'Single Deposit ≥ 5,000' },
    { label: 'Rewards 177.00-17,777.00',   desc: 'First Deposit ≥ 10,000' },
  ];

  private timerInterval: any;
  private timerSeconds = 11 * 3600 + 19 * 60 + 44;

  constructor() {
    addIcons({
      chevronBackOutline,
      headsetOutline,
      documentTextOutline,
      reloadOutline,
      giftOutline,
      chevronDownOutline,
      chevronUpOutline,
      logoWhatsapp
    });
  }

  ngOnInit() {
    this.startTimer();
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
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        const h = Math.floor(this.timerSeconds / 3600);
        const m = Math.floor((this.timerSeconds % 3600) / 60);
        const s = this.timerSeconds % 60;
        this.timer = `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}.0`;
      }
    }, 1000);
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  selectAmount(amount: number) {
    this.selectedAmount = amount;
    this.customAmount = '';
  }

  onInputChange(event: any) {
    const val = event.target.value;
    this.customAmount = val;
    this.selectedAmount = null;
  }

  onCustomAmountChange() {
    if (this.customAmount) {
      this.selectedAmount = null;
    }
  }

  getCurrentAmount(): number {
    return this.selectedAmount || parseInt(this.customAmount) || 0;
  }

  getPaymentBonus(): number {
    const amt = this.getCurrentAmount();
    // 0.5% payment method bonus
    return Math.round(amt * 0.005 * 100) / 100;
  }

  getEventBonus(): number {
    const item = this.amounts.find(a => a.val === this.selectedAmount);
    if (item) {
      // Parse the bonus string (remove '+' and commas)
      return parseFloat(item.bonus.replace(/[+,]/g, ''));
    }
    const pct = 0.25;
    return Math.round(this.getCurrentAmount() * pct * 100) / 100;
  }

  getActualReceive(): number {
    return this.getCurrentAmount() + this.getEventBonus() + this.getPaymentBonus();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  get canDeposit() {
    return this.getCurrentAmount() >= 100;
  }

  submitDeposit() {
    if (this.canDeposit) {
      this.router.navigate(['/offers'], { queryParams: { showTreasure: 'true' } });
    }
  }
}
