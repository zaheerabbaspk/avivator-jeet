import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  headsetOutline,
  documentTextOutline,
  reloadOutline,
  giftOutline,
  chevronDownOutline,
  chevronUpOutline,
  logoWhatsapp,
  shareSocialOutline,
  cloudUploadOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
import { environment } from '../../../environments/environment';

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
  imports: [CommonModule, FormsModule, IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonSpinner, FooterNavComponent]
})
export class DepositPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  selectedMethod = 'jazzcash';
  selectedAmount: number | null = null;
  customAmount: string = '';
  timer: string = '11:19:44.4';
  isPromotionsExpanded = false;
  userBalance = 1.55;
  isLoading = false;
  
  // Manual flow states
  currentStep: 'amount' | 'proof' = 'amount';
  transactionId: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

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
      logoWhatsapp,
      shareSocialOutline,
      cloudUploadOutline
    });
  }

  ngOnInit() {
    this.startTimer();
    this.route.queryParams.subscribe(params => {
      const amount = params['amount'];
      if (amount) {
        this.selectAmount(Number(amount));
      }

      const paymentStatus = params['payment'];
      if (paymentStatus === 'success') {
        alert('Payment successful! Your balance will be updated automatically in a few moments.');
        // Clear query params
        this.router.navigate([], { queryParams: { payment: null }, queryParamsHandling: 'merge' });
      } else if (paymentStatus === 'cancelled') {
        alert('Payment was cancelled.');
        this.router.navigate([], { queryParams: { payment: null }, queryParamsHandling: 'merge' });
      }
    });
    
    // Get real balance from auth service
    this.authService.balance$.subscribe(bal => {
      this.userBalance = bal;
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
    if (this.currentStep === 'proof') {
      this.currentStep = 'amount';
      return;
    }
    this.router.navigate(['/home']);
  }

  get canDeposit() {
    return this.getCurrentAmount() >= 100 && !this.isLoading;
  }

  async submitDeposit() {
    if (!this.canDeposit) return;

    const user = this.authService.userSubject.value;
    if (!user) {
      alert('Please login to deposit');
      return;
    }

    this.isLoading = true;

    try {
      // Call backend to create CashMaal order
      const response: any = await this.http.post(`${environment.backendUrl}/api/payment/create-cashmaal-order`, {
        amount: this.getCurrentAmount(),
        userId: user.id,
        userEmail: user.email
      }).toPromise();

      if (response && response.params) {
        // Create and submit hidden form (Standard for CashMaal SCI)
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.target_url;

        Object.keys(response.params).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = response.params[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error('Invalid response from payment gateway');
      }
    } catch (error: any) {
      console.error('CashMaal Error:', error);
      alert('Payment initialization failed: ' + (error.message || 'Please try again later'));
      this.isLoading = false;
      
      // Fallback to manual proof if API fails (Optional, but fulfills "hide but don't remove" logic)
      // this.currentStep = 'proof'; 
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitManualProof() {
    if (!this.transactionId || !this.selectedFile) {
      alert('Please enter Transaction ID and upload a screenshot');
      return;
    }

    const user = this.authService.userSubject.value;
    if (!user) return;

    this.isLoading = true;
    
    try {
      const file = this.selectedFile;
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${user.id}_${Date.now()}_${sanitizedFileName}`;
      const blob = new Blob([file], { type: file.type });
      
      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await this.supabaseService.supabase.storage
        .from('aviator-jeet')
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = this.supabaseService.supabase.storage
        .from('aviator-jeet')
        .getPublicUrl(fileName);

      // 2. Save to manual_deposits table via RPC to bypass RLS issues
      const { data: rpcData, error: rpcError } = await this.supabaseService.supabase
        .rpc('submit_manual_deposit', {
          p_user_id: user.id,
          p_user_email: user.email || '',
          p_amount: this.getCurrentAmount(),
          p_transaction_id: this.transactionId,
          p_proof_url: publicUrl,
          p_method: this.selectedMethod
        });

      if (rpcError) throw rpcError;
      if (rpcData?.status === 'error') throw new Error(rpcData.message);

      this.isLoading = false;
      alert('Payment proof submitted successfully! Our team will verify it shortly.');
      this.router.navigate(['/home']);

    } catch (error: any) {
      this.isLoading = false;
      console.error('Manual Deposit Error:', error);
      alert('Failed to submit: ' + (error.message || 'Unknown error'));
    }
  }
}
