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
  @Output() close = new EventEmitter<void>();
  @Output() authSuccess = new EventEmitter<void>();

  authMode: 'login' | 'register' = 'register';
  passwordType: 'password' | 'text' = 'password';
  confirmPasswordType: 'password' | 'text' = 'password';

  email = '';
  password = '';
  confirmPassword = '';
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

  async handleAuthAction() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.authMode === 'register' && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    try {
      this.isLoading = true;
      if (this.authMode === 'register') {
        await this.authService.signUp(this.email, this.password);
      } else {
        await this.authService.signIn(this.email, this.password);
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
