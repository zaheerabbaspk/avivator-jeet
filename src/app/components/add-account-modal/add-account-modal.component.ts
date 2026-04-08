import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  closeOutline, 
  personOutline, 
  cardOutline, 
  clipboardOutline,
  alertCircleOutline 
} from 'ionicons/icons';

export interface PaymentMethod {
  key: string;
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-add-account-modal',
  template: `
    <div class="modal-backdrop" (click)="onClose.emit()">
      <div class="modal-sheet" (click)="$event.stopPropagation()">
        <h3 class="modal-title">Add {{ method?.name }}</h3>

        <!-- Real Name -->
        <div class="input-wrap">
          <ion-icon name="person-outline" class="input-icon"></ion-icon>
          <input type="text" [(ngModel)]="realName" placeholder="Please fill in your real name" class="modal-input" />
        </div>

        <!-- Account ID -->
        <div class="input-wrap">
          <img [src]="method?.icon" class="method-icon-sm" *ngIf="method?.icon" />
          <input type="text" [(ngModel)]="accountId"
            placeholder="Please enter {{ method?.name }} ID"
            class="modal-input" />
          <button class="paste-btn">Paste</button>
        </div>

        <!-- 13-digit ID -->
        <div class="input-wrap highlight">
          <ion-icon name="card-outline" class="input-icon"></ion-icon>
          <input type="text" [(ngModel)]="idNumber"
            placeholder="Please enter the 13-digit ID number"
            class="modal-input" maxlength="13" />
        </div>

        <p class="modal-warning">Please check carefully, otherwise it will not be credited.</p>

        <button class="confirm-yellow-btn" [disabled]="!realName || !accountId || idNumber.length !== 13" (click)="onConfirm.emit({realName, accountId, idNumber})">
          Confirm
        </button>

        <button class="modal-close-btn" (click)="onClose.emit()">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 60px;
    }
    .modal-sheet {
      width: calc(100% - 32px);
      max-width: 420px;
      background: #1e1e26;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 24px 20px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }
    .modal-title {
      font-size: 17px;
      font-weight: 800;
      color: #ffffff;
      text-align: center;
      margin: 0 0 8px;
    }
    .input-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #141418;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 14px 16px;
      &.highlight {
        border-color: #f0c040;
        box-shadow: 0 0 10px rgba(240, 192, 64, 0.2);
      }
      .input-icon {
        font-size: 20px;
        color: rgba(255,255,255,0.3);
      }
      .method-icon-sm { 
        width: 32px;
        height: 32px;
        object-fit: contain;
        background: #fff;
        border-radius: 6px;
        padding: 2px;
      }
      .modal-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        &::placeholder { color: rgba(255,255,255,0.25); }
      }
      .paste-btn {
        background: transparent;
        border: none;
        color: #f0c040;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
      }
    }
    .modal-warning {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
      margin: 0;
      text-align: center;
      font-weight: 600;
    }
    .confirm-yellow-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #d4a017, #f0c040);
      color: #1a1000;
      font-size: 15px;
      font-weight: 900;
      border: none;
      border-radius: 14px;
      cursor: pointer;
      &:disabled { filter: grayscale(1) opacity(0.5); cursor: not-allowed; }
    }
    .modal-close-btn {
      position: absolute;
      bottom: -70px;
      left: 50%;
      transform: translateX(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.4);
      background: transparent;
      color: #fff;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon]
})
export class AddAccountModalComponent {
  @Input() method: PaymentMethod | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<any>();

  realName = '';
  accountId = '';
  idNumber = '';

  constructor() {
    addIcons({ closeOutline, personOutline, cardOutline, clipboardOutline, alertCircleOutline });
  }
}
