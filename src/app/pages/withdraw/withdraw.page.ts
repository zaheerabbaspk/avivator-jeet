import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
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
  informationCircleOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';

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
export class WithdrawPage {
  private router = inject(Router);

  isPasswordSet = false; // Simulated state
  activeTab: 'request' | 'account' | 'record' = 'request';

  // Modal State
  showAddModal = false;
  selectedMethod: PaymentMethod | null = null;

  // Form
  realName = '';
  accountId = '';
  idNumber = '';

  paymentMethods: PaymentMethod[] = [
    { key: 'jazzcash', name: 'JazzCash',      icon: '/assets/new-jazz-seeklogo.png',   color: '#E45C2A' },
    { key: 'easypaisa', name: 'Easypaisa',    icon: '/assets/easypaisa-seeklogo.png',  color: '#1AA350' },
    { key: 'bank',      name: 'Bank Transfer', icon: '/assets/images/logos/bank.png',       color: '#2563eb' },
  ];

  constructor() {
    addIcons({
      chevronBackOutline, headsetOutline, refreshOutline,
      addCircleOutline, chevronForwardOutline, walletOutline,
      closeOutline, personOutline, cardOutline, clipboardOutline,
      alertCircleOutline, informationCircleOutline
    });
  }

  setTab(tab: 'request' | 'account' | 'record') {
    this.activeTab = tab;
  }

  openAddModal(method: PaymentMethod) {
    this.selectedMethod = method;
    this.realName = '';
    this.accountId = '';
    this.idNumber = '';
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.selectedMethod = null;
  }

  confirmAdd() {
    // TODO: save account
    this.closeModal();
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
