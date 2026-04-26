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
  reloadOutline, apps, close, reload, gift, ticketOutline, ticket,
  helpCircleOutline, refresh, chevronForwardOutline, paperPlaneOutline,
  ribbon, calendar, calendarNumber, calendarClear, diamond, chevronDown,
  chevronForward, lockClosed, star, chevronBack, card
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { TreasureModalComponent } from '../../components/treasure-modal/treasure-modal.component';
import { OfferCardComponent } from '../../components/offer-card/offer-card.component';
import { OfferHeaderComponent } from '../../components/offer-header/offer-header.component';
import { OfferSidebarComponent } from '../../components/offer-sidebar/offer-sidebar.component';
import { OfferEventComponent } from '../../components/offer-event/offer-event.component';
import { OfferMissionComponent } from '../../components/offer-mission/offer-mission.component';
import { OfferVipComponent } from '../../components/offer-vip/offer-vip.component';
import { OfferUnclaimedComponent } from '../../components/offer-unclaimed/offer-unclaimed.component';
import { OfferHistoryComponent } from '../../components/offer-history/offer-history.component';
import { LuckyDrawModalComponent } from '../../components/lucky-draw-modal/lucky-draw-modal.component';
import { InviteBonusModalComponent } from '../../components/invite-bonus-modal/invite-bonus-modal.component';
import { OffersService, OfferCardData, Mission, VipTier, HistoryRecord, UnclaimedSummary } from '../../services/offers.service';

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
    TreasureModalComponent,
    OfferHeaderComponent,
    OfferSidebarComponent,
    OfferEventComponent,
    OfferMissionComponent,
    OfferVipComponent,
    OfferUnclaimedComponent,
    OfferHistoryComponent,
    LuckyDrawModalComponent,
    InviteBonusModalComponent
  ]
})
export class OffersPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private offersService = inject(OffersService);

  // Navigation State
  activeTab = 'event';
  activeSubTab = 'all';
  activeSidebar = 'all';
  isTreasureModalOpen = false;
  isLuckyDrawModalOpen = false;
  isInviteBonusModalOpen = false;

  tabs = [
    { id: 'event', label: 'Event', badge: '3' },
    { id: 'mission', label: 'Mission' },
    { id: 'vip', label: 'VIP' },
    { id: 'unclaimed', label: 'Unclaimed' },
    { id: 'history', label: 'History' },
  ];

  // Data State
  offers: OfferCardData[] = [];
  missions: Mission[] = [];
  vipTiers: VipTier[] = [];
  historyRecords: HistoryRecord[] = [];
  unclaimed: UnclaimedSummary | null = null;

  // UI State
  activeMissionTab: 'daily' | 'weekly' = 'daily';
  activeVipLevel = 0;
  activeVipData: VipTier | null = null;

  // Filter State
  activeHistoryFilter = 'Today';
  historyPeriods = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month'];
  isHistoryFilterOpen = false;
  pendingHistoryFilter = 'Today';
  isStatusFilterOpen = false;
  activeStatusFilter = 'All';
  statusOptions = ['All', 'Claimed', 'Distributed'];

  // Loading States
  isLoadingRewards = false;
  isLoadingUnclaimed = false;
  isLoadingMissions = false;

  constructor() {
    addIcons({ chevronBackOutline, apps, reload, ticket, close, refresh, paperPlaneOutline, lockClosed, star, chevronBack, chevronForward, helpCircleOutline, diamond, chevronDown, ticketOutline, gift, gridOutline, timeOutline, refreshOutline, giftOutline, reloadOutline, chevronForwardOutline, ribbon, calendar, calendarNumber, calendarClear, card });
  }

  ngOnInit() {
    this.loadAllData();
    this.route.queryParams.subscribe(params => {
      if (params['showTreasure'] === 'true') this.showTreasure();
    });
  }

  loadAllData() {
    this.offers = this.offersService.getOffers();
    this.missions = this.offersService.getMissions(this.activeMissionTab);
    this.vipTiers = this.offersService.getVipTiers();
    this.historyRecords = this.offersService.getHistory(this.activeStatusFilter, this.activeHistoryFilter);
    this.unclaimed = this.offersService.getUnclaimedSummary();
    
    // Set initial VIP focus
    this.activeVipData = this.vipTiers[0];
  }

  setMissionTab(tab: 'daily' | 'weekly') {
    this.activeMissionTab = tab;
    this.missions = this.offersService.getMissions(tab);
  }

  // Navigation
  goBack() { this.router.navigate(['/home']); }
  openOffer(_: any) { this.showTreasure(); }
  showTreasure() { this.isTreasureModalOpen = true; }
  openLuckyDraw() { this.isLuckyDrawModalOpen = true; }

  handleOpenInviteBonus() {
    this.isLuckyDrawModalOpen = false;
    this.isInviteBonusModalOpen = true;
  }

  // Refresh Logic
  refreshRewards() {
    this.isLoadingRewards = true;
    setTimeout(() => { this.isLoadingRewards = false; this.offers = this.offersService.getOffers(); }, 1000);
  }

  refreshUnclaimed() {
    this.isLoadingUnclaimed = true;
    setTimeout(() => { this.isLoadingUnclaimed = false; this.unclaimed = this.offersService.getUnclaimedSummary(); }, 1000);
  }

  refreshMissions() {
    this.isLoadingMissions = true;
    setTimeout(() => { this.isLoadingMissions = false; this.loadAllData(); }, 1000);
  }

  // Filters
  toggleHistoryFilter() {
    this.isHistoryFilterOpen = !this.isHistoryFilterOpen;
    if (this.isHistoryFilterOpen) this.pendingHistoryFilter = this.activeHistoryFilter;
  }

  confirmHistoryFilter() {
    this.activeHistoryFilter = this.pendingHistoryFilter;
    this.isHistoryFilterOpen = false;
    this.historyRecords = this.offersService.getHistory(this.activeStatusFilter, this.activeHistoryFilter);
  }

  toggleStatusFilter() { this.isStatusFilterOpen = !this.isStatusFilterOpen; }

  setStatusFilter(status: string) {
    this.activeStatusFilter = status;
    this.isStatusFilterOpen = false;
    this.historyRecords = this.offersService.getHistory(this.activeStatusFilter, this.activeHistoryFilter);
  }

  openRedemption() {
    // Placeholder for redemption modal/logic
    console.log('Opening redemption...');
  }

  // VIP Logic (Updated for modular components)
  onVipLevelScrollChange(lvl: number) {
    this.activeVipLevel = lvl;
    this.activeVipData = this.vipTiers[lvl];
  }

  getIconArray(count: number): any[] { return Array(Math.max(0, count)); }
}
