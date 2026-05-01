import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonInput, IonCheckbox, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, closeCircleOutline, gift, closeCircle, lockClosed, appsOutline, personAdd, person, chevronBack, alertCircle } from 'ionicons/icons';
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
  referralCode = ''; // Added for manual referral code input
  errorMessage = '';
  isLoading = false;

  showErrors = false;

  constructor() {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, closeCircleOutline, gift, closeCircle, lockClosed, appsOutline, personAdd, person, chevronBack, alertCircle });
  }

  get passwordStrength(): number {
    let strength = 0;
    if (this.password.length > 0) strength++;
    if (this.password.length >= 6) strength++;
    if (/[A-Za-z]/.test(this.password) && /[0-9]/.test(this.password)) strength++;
    if (/[^A-Za-z0-9]/.test(this.password)) strength++;
    // In screenshot, it's a dummy visual or maybe 2 bars filled. Let's just return 2 if there's any password, or calculate.
    // If password empty, show 0. If it has some text like the screenshot "..........", it shows 2 bars.
    return this.password.length > 0 ? Math.max(2, Math.min(4, strength)) : 0;
  }

  phoneError = '';

  validatePhone(event: any) {
    this.errorMessage = ''; // Clear error when typing
    let val = event.target.value;
    
    // Remove any non-numeric characters
    val = val.replace(/\D/g, '');

    if (val.startsWith('0')) {
      this.phoneError = 'Mobile number should not start with 0. Please enter remaining 10 digits.';
      val = val.substring(1);
    } else {
      this.phoneError = '';
    }

    // Limit to 10 digits
    if (val.length > 10) {
      val = val.substring(0, 10);
    }

    this.account = val;
  }

  setAuthMode(mode: 'login' | 'register') {
    this.authMode = mode;
    this.errorMessage = ''; // Clear error when switching tabs
    this.showErrors = false;
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

  private async getAdvancedFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return btoa(navigator.userAgent).substring(0, 32);
    
    // Draw a unique shape with different fills
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("bp999-fingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("bp999-fingerprint", 4, 17);
    
    const canvasData = canvas.toDataURL();
    const rawData = [
      canvasData,
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      this.getOrSetDeviceId()
    ].join('###');

    return btoa(rawData).substring(0, 64);
  }

  private async getPublicIp(): Promise<string> {
    try {
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '0.0.0.0';
    } catch (e) {
      return '0.0.0.0';
    }
  }

  private getOrSetDeviceId(): string {
    let deviceId = localStorage.getItem('app_device_id');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('app_device_id', deviceId);
    }
    return deviceId;
  }

  async handleAuthAction() {
    this.errorMessage = '';
    this.showErrors = true;
    
    if (!this.account || !this.password) {
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

        // Check for manual referral code first, then fall back to localStorage (from URL)
        const inviteCode = this.referralCode || localStorage.getItem('inviteCode');
        
        if (inviteCode) {
          const { data: inviterData } = await this.authService.supabase
            .from('profiles')
            .select('id')
            .eq('game_id', inviteCode)
            .single();
            
          if (inviterData?.id) {
            invitedByUuid = inviterData.id;
          } else if (this.referralCode) {
            // If they manually typed a code and it's wrong, show error
            this.errorMessage = 'Invalid referral code. Please check and try again.';
            this.isLoading = false;
            return;
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

        // Strict Anti-Fraud Layer (IP + Canvas Fingerprint + DeviceID)
        const fingerprint = await this.getAdvancedFingerprint();
        const deviceId = this.getOrSetDeviceId();
        const ip = await this.getPublicIp();

        const { data: existingBonusUser } = await this.authService.supabase
          .from('profiles')
          .select('id')
          .or(`device_fingerprint.eq.${fingerprint},device_id.eq.${deviceId},registration_ip.eq.${ip}`)
          .limit(1);

        let initialBalance = 0;
        if (invitedByUuid && !existingBonusUser) {
          initialBalance = 500; // Updated reward for being referred
        } else if (existingBonusUser) {
          console.warn('Fraud check failed: Multiple accounts detected for this device/IP.');
        }

        // Step 2: Immediately upsert the profile row using the returned user ID
        const { error: profileError } = await this.authService.supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: this.realName,
            email: sanitizedAccount,
            game_id: generatedGameId,
            status: 'active',
            balance: initialBalance,
            package: 'Free',
            invited_by: invitedByUuid,
            device_fingerprint: fingerprint,
            device_id: deviceId,
            registration_ip: ip,
            lucky_spins: 0,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
        }

        // Step 3: Reward the Inviter (Auto-Reward Logic)
        if (invitedByUuid && !existingBonusUser) {
          try {
            // Get inviter's current balance
            const { data: inviterData } = await this.authService.supabase
              .from('profiles')
              .select('balance')
              .eq('id', invitedByUuid)
              .single();

            if (inviterData) {
              const newBalance = (inviterData.balance || 0) + 500;
              await this.authService.supabase
                .from('profiles')
                .update({ balance: newBalance })
                .eq('id', invitedByUuid);
              
              console.log('Inviter reward of Rs 500 added successfully');
            }
          } catch (rewardErr) {
            console.error('Failed to reward inviter:', rewardErr);
          }
        }

        // Step 3: Force refresh auth profile subject so UI shows correct name
        await this.authService.refreshProfile(user.id);

      } else {
        // LOGIN
        await this.authService.signIn(sanitizedAccount, this.password);
      }

      this.authSuccess.emit();
    } catch (error: any) {
      this.isLoading = false;
      const msg: string = error?.message || '';
      const code: string = error?.code || '';
      console.error('Auth action failed:', { error, msg, code });

      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
        this.errorMessage = 'Network Error: Please check your internet connection.';
      } else if (msg.includes('Invalid login credentials') || code === 'invalid_credentials') {
        this.errorMessage = 'Wrong phone/email or password. Please try again.';
      } else if (msg.includes('User already registered') || msg.includes('already in use') || code === '23505') {
        this.errorMessage = 'This mobile number is already registered. Please login.';
      } else if (msg.includes('Email not confirmed')) {
        this.errorMessage = 'Please confirm your account before logging in.';
      } else if (msg.includes('rate limit')) {
        this.errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
      } else {
        this.errorMessage = msg || 'Authentication failed. Please try again later.';
      }
    } finally {
      this.isLoading = false;
    }
  }


  dismiss() {
    this.close.emit();
  }
}
