import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, eyeOutline, eyeOffOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-withdrawal-password',
  template: `
    <div class="withdraw-pwd-container">

  <div class="pwd-content">
    <p class="status-msg">For the safety of your funds, you need to set a withdrawal password first!</p>

    <div class="input-section">
      <div class="label-row">
        <span>Set up Withdrawal Password</span>
        <ion-icon [name]="showPwd ? 'eye-outline' : 'eye-off-outline'" (click)="showPwd = !showPwd"></ion-icon>
      </div>
      <div class="digits-row">
        @for (d of pwdDigits; track $index) {
          <input 
            type="tel" 
            maxlength="1" 
            [(ngModel)]="pwdDigits[$index]"
            (input)="onInput($event, $index, 'pwd')"
            (keydown)="onKeyDown($event, $index, 'pwd')"
            class="digit-input" />
        }
      </div>
    </div>

    <div class="input-section mt-6">
      <div class="label-row">
        <span>Confirm new Withdrawal Password</span>
        <ion-icon [name]="showConfirmPwd ? 'eye-outline' : 'eye-off-outline'" (click)="showConfirmPwd = !showConfirmPwd"></ion-icon>
      </div>
      <div class="digits-row">
        @for (d of confirmDigits; track $index) {
          <input 
            type="tel" 
            maxlength="1" 
            [(ngModel)]="confirmDigits[$index]"
            (input)="onInput($event, $index, 'confirm')"
            (keydown)="onKeyDown($event, $index, 'confirm')"
            class="digit-input" />
        }
      </div>
    </div>

    <div class="attention-box">
      <ion-icon name="alert-circle-outline"></ion-icon>
      <p>
        Attention: The withdrawal password protects your funds and is extremely important. 
        Keep it to yourself to prevent any financial loss
      </p>
    </div>
  </div>

  <div class="footer">
    <button class="confirm-btn" [disabled]="!canConfirm" (click)="submit()">
      Confirm
    </button>
  </div>
    </div>
  `,
  styles: [`
    .withdraw-pwd-container {
      display: flex;
      flex-direction: column;
      background: #141418;
    }
    .pwd-content {
      padding: 12px 16px;
    }
    .status-msg {
      color: #00ff66; /* Vibrant green from screen */
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .digits-row {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1.5px;
      background: rgba(255,255,255,0.05); /* The border color effect */
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      overflow: hidden;
    }
    .digit-input {
      width: 100%;
      height: 54px;
      background: #1e1e26;
      border: none;
      border-right: 1.5px solid rgba(23, 23, 28, 1);
      color: #fff;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      outline: none;
      &:last-child { border-right: none; }
    }
    .attention-box {
      margin-top: 30px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
      color: #ef4444;
      ion-icon {
        font-size: 16px;
        margin-top: 2px;
      }
      p {
        font-size: 12px;
        margin: 0;
        line-height: 1.5;
        font-weight: 600;
      }
    }
    .footer {
      padding: 16px;
      background: #141418;
    }
    .confirm-btn {
      width: 100%;
      padding: 14px;
      background: #f0c040;
      color: #1a1000;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 800;
      &:disabled {
        background: #444;
        color: #777;
      }
    }
    .mt-6 { margin-top: 24px; }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon]
})
export class WithdrawalPasswordComponent {
  // Use arrays for 6 digits
  pwdDigits: string[] = ['', '', '', '', '', ''];
  confirmDigits: string[] = ['', '', '', '', '', ''];

  showPwd = false;
  showConfirmPwd = false;

  @Output() onConfirm = new EventEmitter<string>();
  @Output() onBack = new EventEmitter<void>();

  constructor() {
    addIcons({ closeOutline, eyeOutline, eyeOffOutline, alertCircleOutline });
  }

  // Handle digit input
  onInput(event: any, index: number, type: 'pwd' | 'confirm') {
    const val = event.target.value;
    const array = type === 'pwd' ? this.pwdDigits : this.confirmDigits;
    
    // Only allow numbers
    if (val && !/^\d+$/.test(val)) {
      array[index] = '';
      return;
    }

    if (val.length === 1 && index < 5) {
      if (event.target.parentElement) {
        const nextInput = event.target.parentElement.querySelectorAll('input')[index + 1] as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  }

  // Handle backspace
  onKeyDown(event: KeyboardEvent, index: number, type: 'pwd' | 'confirm') {
    if (event.key === 'Backspace' && index > 0 && !((type === 'pwd' ? this.pwdDigits : this.confirmDigits)[index])) {
      const prevInput = (event.target as HTMLInputElement).parentElement?.querySelectorAll('input')[index - 1] as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }

  get canConfirm() {
    const p = this.pwdDigits.join('');
    const c = this.confirmDigits.join('');
    return p.length === 6 && p === c;
  }

  submit() {
    if (this.canConfirm) {
      this.onConfirm.emit(this.pwdDigits.join(''));
    }
  }
}
