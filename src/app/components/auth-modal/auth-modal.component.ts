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
    // If numeric, it's likely a phone number, map to virtual email for Supabase compatibility
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed}@gmail.com`;
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
        // Generate a random 9-digit numeric ID for the user
        const generatedGameId = Math.floor(100000000 + Math.random() * 900000000).toString();

        let invitedByUuid: string | null = null;

        // Check for invite code in localStorage
        const inviteCode = localStorage.getItem('inviteCode');
        if (inviteCode) {
          const { data: inviterData } = await this.authService.supabase
            .from('profiles')
            .select('id')
            .eq('game_id', inviteCode)
            .single();
          if (inviterData?.id) {
            invitedByUuid = inviterData.id;
          }
        }

        // Step 1: Create auth user
        const user = await this.authService.signUp(sanitizedAccount, this.password, {
          full_name: this.realName,
          email: sanitizedAccount,
          game_id: generatedGameId
        });

        if (!user) {
          this.errorMessage = 'Registration failed. Please try again.';
          return;
        }

        // Step 2: Immediately upsert the profile row using the returned user ID
        // This must happen BEFORE onAuthStateChange fires refreshProfile
        const { error: profileError } = await this.authService.supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: this.realName,
            email: sanitizedAccount,
            game_id: generatedGameId,
            status: 'active',
            balance: 0,
            package: 'Free',
            invited_by: invitedByUuid,
            lucky_spins: 0,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
          // Non-fatal: auth succeeded, profile may self-heal on next refresh
        }

        // Step 3: Force refresh auth profile subject so UI shows correct name
        await this.authService.refreshProfile(user.id);

      } else {
        // LOGIN
        await this.authService.signIn(sanitizedAccount, this.password);
      }

      this.authSuccess.emit();
    } catch (error: any) {
      // Provide friendly error messages
      const msg: string = error?.message || '';
      console.error('Auth action failed:', error);

      if (msg.toLowerCase().includes('failed to fetch')) {
        this.errorMessage = 'Network Error: Please check your internet connection or try again later.';
      } else if (msg.includes('Invalid login credentials')) {
        this.errorMessage = 'Wrong phone/email or password. Please try again.';
      } else if (msg.includes('User already registered')) {
        this.errorMessage = 'This account already exists. Please login instead.';
      } else if (msg.includes('Email not confirmed')) {
        this.errorMessage = 'Please confirm your email before logging in.';
      } else {
        this.errorMessage = msg || 'Authentication failed. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }


  dismiss() {
    this.close.emit();
  }
}
