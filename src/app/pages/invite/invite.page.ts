import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonIcon, IonButton, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  peopleOutline, 
  walletOutline, 
  copyOutline, 
  shareSocialOutline,
  giftOutline,
  cashOutline,
  trendingUpOutline,
  shieldCheckmarkOutline,
  headsetOutline,
  documentTextOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { DepositModalComponent } from '../../components/deposit-modal/deposit-modal.component';
import { RewardModalComponent } from '../../components/reward-modal/reward-modal.component';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonContent, IonIcon, IonButton, IonToast, FooterNavComponent, DepositModalComponent, RewardModalComponent]
})
export class InvitePage implements OnInit {
  private router = inject(Router);
  
  showCopyToast = false;
  isDepositModalOpen = false;
  isRewardModalOpen = false;
  toastMessage = '';

  stats = {
    totalInvited: 0,
    totalRewards: '0.00',
    currentLevel: 'V0'
  };

  referralCode = 'JET69281';
  referralLink = 'https://aviatorjeet.com/register?ref=JET69281';

  constructor() {
    addIcons({ 
      chevronBackOutline, 
      peopleOutline, 
      walletOutline, 
      copyOutline, 
      shareSocialOutline,
      giftOutline,
      cashOutline,
      trendingUpOutline,
      shieldCheckmarkOutline,
      headsetOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
    // Automatically show reward modal after a short delay
    setTimeout(() => {
      this.isRewardModalOpen = true;
    }, 800);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toastMessage = `Copied to clipboard!`;
      this.showCopyToast = true;
    });
  }

  shareInvite() {
    if (navigator.share) {
      navigator.share({
        title: 'Join Aviator Jeet!',
        text: 'Join me on Aviator Jeet and get exclusive rewards!',
        url: this.referralLink
      });
    } else {
      this.copyToClipboard(this.referralLink);
    }
  }

  openDeposit() {
    this.isDepositModalOpen = true;
  }

  closeDeposit() {
    this.isDepositModalOpen = false;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  handleSupport() {
    console.log('Support clicked');
  }

  handleRecords() {
    console.log('Records clicked');
  }
}
