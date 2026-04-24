import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  walletOutline,
  cashOutline,
  trendingUpOutline,
  briefcaseOutline,
  documentTextOutline,
  settingsOutline,
  shareSocialOutline,
  personOutline,
  shieldCheckmarkOutline,
  searchOutline,
  globeOutline,
  helpCircleOutline,
  chatbubbleOutline,
  phonePortraitOutline,
  chevronForwardOutline,
  chevronBackOutline,
  headsetOutline,
  chatbubbleEllipsesOutline,
  pencilOutline,
  copyOutline,
  refreshOutline,
  shieldHalfOutline,
  giftOutline,
  peopleOutline,
  logInOutline,
  personAddOutline,
  mailOutline,
  logOutOutline,
  syncOutline,
  caretDownOutline,
  notificationsOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { RewardModalComponent } from '../../components/reward-modal/reward-modal.component';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { ProfileEditModalComponent } from '../../components/profile-edit-modal/profile-edit-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonToast, AuthModalComponent, RewardModalComponent, FooterNavComponent, ProfileEditModalComponent]
})
export class ProfilePage {
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoggedIn = false;
  isAuthModalOpen = false;
  isRewardModalOpen = false;
  isProfileEditModalOpen = false;
  showCopyToast = false;
  toastMessage = '';
  isLoadingBalance = false;

  user = {
    username: '',
    fullName: '',
    phone: '',
    email: '',
    id: '',
    balance: '0.00',
    vipLevel: 'V0',
    progress: 0.00,
    required: 100.00,
    bonus: '0.00'
  };

  constructor() {
    addIcons({
      walletOutline,
      cashOutline,
      trendingUpOutline,
      briefcaseOutline,
      documentTextOutline,
      settingsOutline,
      shareSocialOutline,
      personOutline,
      shieldCheckmarkOutline,
      searchOutline,
      globeOutline,
      helpCircleOutline,
      chatbubbleOutline,
      phonePortraitOutline,
      chevronForwardOutline,
      chevronBackOutline,
      headsetOutline,
      chatbubbleEllipsesOutline,
      pencilOutline,
      copyOutline,
      refreshOutline,
      shieldHalfOutline,
      giftOutline,
      peopleOutline,
      logInOutline,
      personAddOutline,
      mailOutline,
      logOutOutline,
      syncOutline,
      caretDownOutline,
      notificationsOutline
    });

    // Subscribe to auth state
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (!user) this.resetUser();
    });

    // Subscribe to profile$ so UI updates reactively when AuthService refreshes the profile
    this.authService.profile$.subscribe(profile => {
      if (profile) {
        this.mapProfile(profile);
      }
    });

    // Subscribe to balance
    this.authService.balance$.subscribe(bal => {
      this.user.balance = bal.toFixed(2);
    });
  }

  mapProfile(data: any) {
    this.user.fullName = data['full_name'] || '';
    this.user.email = data['email'] || '';
    this.user.id = data['game_id'] || '';
    this.user.balance = (data['balance'] || 0).toFixed(2);
    this.user.phone = data['phone'] || '---';
    // Username: prefer the part before @ in email, fallback to fullName
    this.user.username = data['email']
      ? data['email'].split('@')[0]
      : (data['full_name'] || 'user');
  }

  async fetchProfile(userId: string) {
    try {
      const { data, error } = await this.authService.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile row not found — use auth metadata as fallback display
        const meta = this.authService.userSubject.value?.user_metadata;
        if (meta) {
          this.user.fullName = meta['full_name'] || '';
          this.user.id = meta['game_id'] || '---';
        }
        return;
      }

      if (error) throw error;

      if (data) {
        // Ensure game_id exists
        if (!data['game_id']) {
          data['game_id'] = Math.floor(100000000 + Math.random() * 900000000).toString();
          await this.authService.supabase
            .from('profiles')
            .update({ game_id: data['game_id'] })
            .eq('id', userId);
        }
        this.mapProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to auth metadata
      const meta = this.authService.userSubject.value?.user_metadata;
      if (meta) {
        this.user.fullName = meta['full_name'] || '';
        this.user.id = meta['game_id'] || '---';
      }
    }
  }

  resetUser() {
    this.user = {
      username: '',
      fullName: '',
      phone: '',
      email: '',
      id: '',
      balance: '0.00',
      vipLevel: 'V0',
      progress: 0.00,
      required: 100.00,
      bonus: '0.00'
    };
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toastMessage = `Copied: ${text}`;
      this.showCopyToast = true;
    });
  }

  navigateTo(path: string) {
    if (!this.isLoggedIn && path !== '/home') {
      this.isAuthModalOpen = true;
      return;
    }
    this.router.navigate([path]);
  }

  handleRewardDeposit(amount: number) {
    this.isRewardModalOpen = false;
    this.navigateTo(`/deposit?amount=${amount}`);
  }

  async saveProfile(data: { fullName: string, phone: string, email: string }) {
    try {
      await this.authService.updateProfile({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email
      });
      
      this.user.fullName = data.fullName;
      this.user.phone = data.phone;
      this.user.email = data.email;

      this.toastMessage = 'Profile updated successfully!';
      this.showCopyToast = true;
    } catch (error) {
      console.error('Error updating profile:', error);
      this.toastMessage = 'Failed to update profile';
      this.showCopyToast = true;
    }
  }

  async refreshBalance() {
    if (this.isLoadingBalance) return;

    const user = this.authService.userSubject.value;
    if (!user) return;

    this.isLoadingBalance = true;
    try {
      // Use service-level refresh so profile$ and balance$ subjects update reactively
      await this.authService.refreshProfile(user.id);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setTimeout(() => {
        this.isLoadingBalance = false;
      }, 800);
    }
  }
 
  logout() {
    this.authService.logout();
    this.navigateTo('/home');
  }

  openAuth(mode: 'login' | 'register') {
    this.isAuthModalOpen = true;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
