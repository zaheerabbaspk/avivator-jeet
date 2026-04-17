import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonToast, IonHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBack, 
  copyOutline, 
  shareSocialOutline,
  gift,
  cash,
  trendingUp,
  headset,
  documentText,
  person,
  helpCircleOutline,
  copy,
  apps,
  reload,
  paperPlane,
  logoFacebook,
  logoInstagram,
  logoWhatsapp,
  close,
  chevronForward,
  star,
  calendar,
  card,
  diamond,
  syncCircleOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { InviteHeaderComponent } from '../../components/invite-header/invite-header.component';
import { InviteTabsComponent } from '../../components/invite-tabs/invite-tabs.component';
import { InviteBannerComponent } from '../../components/invite-banner/invite-banner.component';
import { InviteStatsComponent } from '../../components/invite-stats/invite-stats.component';
import { InviteLinkComponent } from '../../components/invite-link/invite-link.component';
import { InviteCommissionComponent } from '../../components/invite-commission/invite-commission.component';
import { PromotionSharingComponent } from '../../components/promotion-sharing/promotion-sharing.component';
import { MyDataComponent } from '../../components/my-data/my-data.component';
import { PerformanceTabComponent } from '../../components/performance-tab/performance-tab.component';
import { CommissionTabComponent } from '../../components/commission-tab/commission-tab.component';
import { LuckyDrawModalComponent } from '../../components/lucky-draw-modal/lucky-draw-modal.component';
import { InviteService, AgentStats, InviteStats, CommissionCard, InviteBanner, MyDataStats } from '../../services/invite.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, 
    IonHeader,
    IonIcon, 
    IonToast, 
    FooterNavComponent,
    InviteHeaderComponent,
    InviteTabsComponent,
    InviteBannerComponent,
    InviteStatsComponent,
    InviteLinkComponent,
    InviteCommissionComponent,
    PromotionSharingComponent,
    MyDataComponent,
    PerformanceTabComponent,
    CommissionTabComponent,
    LuckyDrawModalComponent
  ]
})
export class InvitePage implements OnInit {
  isSpinModalOpen = false;
  private router = inject(Router);
  private inviteService = inject(InviteService);
  
  // State
  activeTab = 'home';
  showCopyToast = false;
  toastMessage = '';
  isFloatingLogoVisible = true;

  // Data
  agentStats!: AgentStats;
  inviteStats!: InviteStats;
  myDataStats!: MyDataStats;
  banners: InviteBanner[] = [];
  commissions: CommissionCard[] = [];
  referralLink = '';
  referralCode = '';

  constructor() {
    addIcons({ 
      chevronBack, 
      copyOutline, 
      shareSocialOutline,
      gift,
      cash,
      trendingUp,
      headset,
      documentText,
      person,
      helpCircleOutline,
      copy,
      apps,
      reload,
      paperPlane,
      logoFacebook,
      logoInstagram,
      logoWhatsapp,
      close,
      chevronForward,
      star,
      calendar,
      card,
      diamond,
      syncCircleOutline
    });
  }

  ngOnInit() {
    this.loadData();
    // Removed auto-open for cleaner mobile entry
  }

  loadData() {
    this.agentStats = this.inviteService.getAgentStats();
    this.inviteStats = this.inviteService.getInviteStats();
    this.myDataStats = this.inviteService.getMyDataStats();
    this.banners = this.inviteService.getBanners();
    this.commissions = this.inviteService.getCommissions();
    this.referralCode = this.agentStats.account;
    this.referralLink = this.inviteService.getReferralLink(this.referralCode);
  }

  handleTabChange(tabId: string) {
    this.activeTab = tabId;
  }

  handleBack() {
    this.router.navigate(['/home']);
  }

  handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toastMessage = `Copied!`;
      this.showCopyToast = true;
    });
  }

  handleShare(platform: string) {
    console.log('Sharing on platform:', platform);
    if (navigator.share) {
      navigator.share({
        title: 'Join Aviator Jeet!',
        text: 'Special invitation reward waiting for you!',
        url: this.referralLink
      });
    }
  }

  handleClaim(commission: CommissionCard) {
    console.log('Claiming commission:', commission.title);
    this.toastMessage = 'Claim successful!';
    this.showCopyToast = true;
  }

  closeFloatingLogo() {
    this.isFloatingLogoVisible = false;
  }
}
