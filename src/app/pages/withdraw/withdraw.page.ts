import { Component, inject, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  headsetOutline,
  refreshOutline,
  addCircleOutline,
  chevronForwardOutline,
  walletOutline,
  closeOutline,
  personOutline,
  cardOutline,
  clipboardOutline,
  alertCircleOutline,
  informationCircleOutline,
  swapHorizontalOutline,
  chevronDownOutline,
  settingsOutline,
  eyeOffOutline,
  eyeOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WithdrawService } from '../../services/withdraw.service';

// Interface moved to add-account-modal component
import { WithdrawalPasswordComponent } from '../../components/withdrawal-password/withdrawal-password.component';
import { AddAccountModalComponent, PaymentMethod } from '../../components/add-account-modal/add-account-modal.component';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    WithdrawalPasswordComponent,
    AddAccountModalComponent,
    FooterNavComponent
  ]

})
export class WithdrawPage implements OnInit {
  private router = inject(Router);
  public authService = inject(AuthService);
  private withdrawService = inject(WithdrawService);
  private alertController = inject(AlertController);
  private cdr = inject(ChangeDetectorRef);

  isPasswordSet = false;
  activeTab: 'request' | 'account' | 'record' = 'request';
  userBalance = 0;
  isLoadingBalance = false;

  // Added accounts list
  addedAccounts: any[] = [];
  selectedAccount: any = null;
  withdrawalHistory: any[] = [];
  isLoadingHistory = false;
  showFullAccountId = false;

  // PIN Verification
  verifyPin = ['', '', '', '', '', ''];

  // Modal State
  showAddModal = false;
  selectedMethod: PaymentMethod | null = null;

  // Withdrawal State
  withdrawAmount: number | null = null;

  paymentMethods: PaymentMethod[] = [
    { key: 'jazzcash', name: 'JazzCash', icon: '/assets/new-jazz-seeklogo.png', color: '#E45C2A' },
    { key: 'easypaisa', name: 'Easypaisa', icon: '/assets/easypaisa-seeklogo.png', color: '#1AA350' },
    { key: 'bank', name: 'Bank Transfer', icon: '/assets/images/logos/bank.png', color: '#2563eb' },
  ];

  constructor() {
    addIcons({ chevronBackOutline, refreshOutline, walletOutline, chevronDownOutline, cardOutline, settingsOutline, eyeOffOutline, eyeOutline, chevronForwardOutline, headsetOutline, addCircleOutline, alertCircleOutline, informationCircleOutline, swapHorizontalOutline });
  }

  ngOnInit() {
    // 1. Sync Balance
    this.authService.balance$.subscribe((b: number) => this.userBalance = b);

    // 2. Load accounts and check PIN
    this.initData();

    // 3. Subscribe to service accounts for real-time updates
    this.withdrawService.accounts$.subscribe(accs => {
      this.addedAccounts = accs;
      if (accs.length > 0 && !this.selectedAccount) {
        this.selectedAccount = accs[0];
      }
    });
  }

  async initData() {
    const { data: savedPin } = await this.withdrawService.checkWithdrawalPassword();
    this.isPasswordSet = !!savedPin;
    await this.withdrawService.fetchAccounts();
    await this.loadHistory();
  }

  async loadHistory() {
    this.isLoadingHistory = true;
    this.cdr.detectChanges();
    const { data } = await this.withdrawService.fetchWithdrawalHistory();
    if (data) {
      this.withdrawalHistory = data;
    }
    this.isLoadingHistory = false;
    this.cdr.detectChanges();
  }

  setTab(tab: 'request' | 'account' | 'record') {
    this.activeTab = tab;
    this.cdr.detectChanges(); // Force angular DOM update
    if (tab === 'record') {
      this.loadHistory();
    }
  }

  onSegmentChange(event: any) {
    if (event.detail.value && this.activeTab !== event.detail.value) {
      this.setTab(event.detail.value);
    }
  }

  openAddModal(method: PaymentMethod) {
    this.selectedMethod = method;
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.selectedMethod = null;
  }

  async confirmAdd(formData: any) {
    if (!this.selectedMethod) return;

    try {
      await this.withdrawService.addAccount({
        method_key: this.selectedMethod.key,
        method_name: this.selectedMethod.name,
        real_name: formData.realName,
        account_id: formData.accountId,
        id_number: formData.idNumber
      });
      this.closeModal();
    } catch (error) {
      console.error('Failed to add account:', error);
      alert('Failed to save account. Please check your connection.');
    }
  }

  async refreshBalance() {
    if (this.isLoadingBalance) return;
    this.isLoadingBalance = true;
    const user = this.authService.userSubject.value;
    if (user) {
      await this.authService.refreshProfile(user.id);
    }
    setTimeout(() => this.isLoadingBalance = false, 800);
  }

  onPinInput(event: any, index: number) {
    const val = event.target.value;
    if (val.length === 1 && index < 5) {
      const parent = event.target.parentElement;
      const inputs = parent.querySelectorAll('input');
      if (inputs[index + 1]) inputs[index + 1].focus();
    }
  }

  onPinKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && index > 0 && !this.verifyPin[index]) {
      const parent = (event.target as HTMLInputElement).parentElement;
      const inputs = parent?.querySelectorAll('input');
      if (inputs && inputs[index - 1]) inputs[index - 1].focus();
    }
  }

  async onPinSet(pin: string) {
    const { data, error } = await this.withdrawService.saveWithdrawalPassword(pin);

    if (error) {
      if (error.code === '23505' || error.message === 'PIN already exists') {
        this.showPremiumAlert('PIN Taken', 'This PIN is already used by another user. Please choose a unique 6-digit PIN.');
      } else if (error.code === '42703' || error.message?.includes('column')) {
        this.showPremiumAlert('Database Error', 'The withdrawal system is not fully setup. Please run the SQL code provided previously in your Supabase editor.');
      } else {
        this.showPremiumAlert('Error', 'Failed to save PIN. Error: ' + (error.message || 'Unknown error'));
      }
      return;
    }

    // Success
    this.isPasswordSet = true;
    this.showPremiumAlert('Success', 'Your withdrawal PIN has been set successfully! You can now proceed with your withdrawal.');

    // Refresh data to be sure
    await this.initData();
  }

  async confirmWithdrawal() {
    if (!this.selectedAccount) {
      this.showPremiumAlert('Selection Error', 'Please select or add a receiving account first.');
      return;
    }

    if (this.userBalance < 200) {
      this.showPremiumAlert('Insufficient Balance', 'You must have at least 200 Rs in your account to request a withdrawal.');
      return;
    }

    if (!this.withdrawAmount || this.withdrawAmount < 200) {
      this.showPremiumAlert('Amount Error', 'Minimum withdrawal amount is 200 Rs.');
      return;
    }

    if (this.withdrawAmount > this.userBalance) {
      this.showPremiumAlert('Balance Error', 'Requested amount exceeds your current balance.');
      return;
    }

    const enteredPin = this.verifyPin.join('');
    if (enteredPin.length < 6) {
      this.showPremiumAlert('PIN Error', 'Please enter your complete 6-digit withdrawal PIN.');
      return;
    }

    const { data: savedPin, error } = await this.withdrawService.checkWithdrawalPassword();

    if (error) {
      const err = error as any;
      if (err.code === '42703' || err.message?.includes('column')) {
        this.showPremiumAlert('Database Error', 'The withdrawal system is not fully setup. Please run the SQL code provided previously in your Supabase editor.');
      } else {
        this.showPremiumAlert('Connection Error', 'Could not verify PIN. Please check your internet connection.');
      }
      return;
    }

    if (!savedPin) {
      this.showPremiumAlert('PIN Not Found', 'No withdrawal PIN found for your account. Please set it up in your profile first.');
      this.isPasswordSet = false; // Reset to show setup screen
      return;
    }

    if (enteredPin !== savedPin) {
      this.showPremiumAlert('Security Error', 'Incorrect PIN. Please try again.');
      // Clear PIN on error
      this.verifyPin = ['', '', '', '', '', ''];
      return;
    }

    // PIN is correct, submit to DB
    const withdrawValue = this.withdrawAmount; // Save copy before resetting

    const { data: requestData, error: requestError } = await this.withdrawService.submitWithdrawalRequest(withdrawValue, this.selectedAccount.id);

    if (requestError) {
      const err = requestError as any;
      if (err.code === '42P01' || err.message?.includes('does not exist')) {
        this.showPremiumAlert('Database Error', 'The withdrawal system is not fully setup. Please run the SQL code provided previously in your Supabase editor.');
      } else {
        this.showPremiumAlert('Submission Error', 'Failed to submit withdrawal request. Please try again later.');
      }
      return;
    }

    // Immediately deduct the balance
    await this.authService.updateBalance(-withdrawValue);

    this.showPremiumAlert('Success', 'Your withdrawal request of Rs ' + withdrawValue + ' has been submitted and is pending review!');

    // Clear form
    this.withdrawAmount = null;
    this.verifyPin = ['', '', '', '', '', ''];
  }

  async showPremiumAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'premium-alert',
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
