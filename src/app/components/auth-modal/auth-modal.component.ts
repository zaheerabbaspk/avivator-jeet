import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonInput, IonCheckbox, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, closeCircleOutline, gift } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonModal, IonInput, IonCheckbox, IonIcon, IonButton, FormsModule]
})
export class AuthModalComponent {
  private authService = inject(AuthService);
  
  @Input() isOpen = false;
  @Input() authMode: 'login' | 'register' = 'register';
  @Output() close = new EventEmitter<void>();
  @Output() authSuccess = new EventEmitter<void>();

  passwordType: 'password' | 'text' = 'password';
  confirmPasswordType: 'password' | 'text' = 'password';

  account = '';
  password = '';
  confirmPassword = '';
  realName = '';
  errorMessage = '';
  isLoading = false;

  constructor() {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, closeCircleOutline, gift });
  }

  setAuthMode(mode: 'login' | 'register') {
    this.authMode = mode;
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
  }

  private sanitizeAccount(input: string): string {
    const trimmed = input.trim();
    // If numeric, it's likely a phone number, map to virtual email for Firebase compatibility
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed}@sk804.com`;
    }
    return trimmed;
  }

  async handleAuthAction() {
    this.errorMessage = '';
    
    if (!this.account || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.authMode === 'register' && !this.realName) {
      this.errorMessage = 'Please enter your real name';
      return;
    }

    if (this.authMode === 'register' && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    try {
      this.isLoading = true;
      const sanitizedAccount = this.sanitizeAccount(this.account);
      
      if (this.authMode === 'register') {
        await this.authService.signUp(sanitizedAccount, this.password);
      } else {
        await this.authService.signIn(sanitizedAccount, this.password);
      }
      this.authSuccess.emit();
    } catch (error: any) {
      this.errorMessage = error.message || 'Authentication failed';
    } finally {
      this.isLoading = false;
    }
  }


  dismiss() {
    this.close.emit();
  }
}
