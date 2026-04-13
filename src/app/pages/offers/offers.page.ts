import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  gridOutline,
  timeOutline,
  refreshOutline,
  giftOutline,
  reloadOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { TreasureModalComponent } from '../../components/treasure-modal/treasure-modal.component';

export interface OfferCard {
  id: string;
  brand: string;   // used for alt text
  bannerImg: string;   // full card image banner
  brandColor: string;   // used for card border
}

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    FooterNavComponent,
    TreasureModalComponent
  ]
})
export class OffersPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = 'event';
  activeSubTab = 'all'; // Lower sub-category tabs
  activeSidebar = 'all';
  isTreasureModalOpen = false;

  tabs = [
    { id: 'event', label: 'Event', badge: 3 },
    { id: 'mission', label: 'Mission', badge: 1 },
    { id: 'vip', label: 'VIP' },
    { id: 'unclaimed', label: 'Unclaimed' },
    { id: 'history', label: 'History' },
  ];

  subTabs = [
    { id: 'all', label: 'All', icon: '/siteadmin/skin/lobby_asset/common/web/common/icon_dtfl_zh_0.svg' },
    { id: 'cooperate', label: 'cooperate' },
  ];

  offers: OfferCard[] = [
    {
      id: '788win',
      brand: '788win.com',
      bannerImg: 'assets/main.png',
      brandColor: '#fccc04', // Gold
    },
    {
      id: '877bet',
      brand: '877bet.com',
      bannerImg: 'assets/main1.png',
      brandColor: '#4ade80', // Light green
    },
    {
      id: '588win',
      brand: '588win',
      bannerImg: 'assets/main2.png',
      brandColor: '#ffedd5', // Light orange/white outline
    },
    {
      id: '388win',
      brand: '388win',
      bannerImg: 'assets/main3.png',
      brandColor: '#3b82f6', // Bright blue
    },
    {
      id: '288win',
      brand: '288win',
      bannerImg: 'assets/main4.png',
      brandColor: '#22c55e', // Green
    },
    {
      id: '288win',
      brand: '288win',
      bannerImg: 'assets/main5.png',
      brandColor: '#22c55e', // Green
    },

    {
      id: '288win',
      brand: '288win',
      bannerImg: 'assets/mm.png',
      brandColor: '#22c55e', // Green
    },
    {
      id: '288win',
      brand: '288win',
      bannerImg: 'assets/mmm.png',
      brandColor: '#22c55e', // Green
    },
    {
      id: '288win',
      brand: '288win',
      bannerImg: 'assets/mmmm.png',
      brandColor: '#22c55e', // Green
    },
    {
      id: '288win',
      brand: '288win',
      bannerImg: 'assets/mmmmmm.png',
      brandColor: '#22c55e', // Green
    },
  ];

  showCopyToast = false;
  toastMessage = '';
  isLoadingRewards = false;

  constructor() {
    addIcons({ chevronBackOutline, gridOutline, timeOutline, refreshOutline, giftOutline, reloadOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['showTreasure'] === 'true') this.showTreasure();
    });
  }

  goBack() { this.router.navigate(['/home']); }
  openOffer(_: any) { this.showTreasure(); }
  showTreasure() { this.isTreasureModalOpen = true; }

  refreshRewards() {
    if (this.isLoadingRewards) return;
    this.isLoadingRewards = true;
    setTimeout(() => {
      this.isLoadingRewards = false;
    }, 1500);
  }

  openRedemption() { }
}
