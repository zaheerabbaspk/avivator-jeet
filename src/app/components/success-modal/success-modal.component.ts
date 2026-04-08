import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircleOutline, gift, downloadOutline, walletOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonModal, IonIcon, IonButton]
})
export class SuccessModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() deposit = new EventEmitter<void>();

  constructor() {
    addIcons({ checkmarkCircle, closeCircleOutline, gift, downloadOutline, walletOutline, chevronForwardOutline });
  }

  dismiss() {
    this.close.emit();
  }

  onDeposit() {
    this.deposit.emit();
    this.dismiss();
  }
}
