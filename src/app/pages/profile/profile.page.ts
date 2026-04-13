import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonProgressBar, IonToast } from '@ionic/angular/standalone';
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
  imports: [CommonModule, IonHeader, IonContent, IonFooter, IonIcon, IonButton, IonProgressBar, IonToast, AuthModalComponent, RewardModalComponent, FooterNavComponent, ProfileEditModalComponent]
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
    username: 'pwrt1287',
    fullName: 'Faizan Chaudhary',
    phone: '+92 312 4567890',
    email: 'faizan.c@example.com',
    id: '262287110',
    balance: '0.00',
    vipLevel: 'V0',
    progress: 0.00,
    required: 100.00,
    bonus: '1.80'
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

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
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

  saveProfile(data: { fullName: string, phone: string, email: string }) {
    this.user.fullName = data.fullName;
    this.user.phone = data.phone;
    this.user.email = data.email;

    // Potentially save to backend here
    this.toastMessage = 'Profile updated successfully!';
    this.showCopyToast = true;
  }

  refreshBalance() {
    if (this.isLoadingBalance) return;
    this.isLoadingBalance = true;
    setTimeout(() => {
      this.isLoadingBalance = false;
    }, 1500);
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
