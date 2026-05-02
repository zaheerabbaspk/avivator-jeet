import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonModal, IonPicker, IonPickerColumn, IonPickerColumnOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  chevronForwardOutline,
  chevronDownOutline,
  chevronUpOutline,
  syncOutline,
  closeOutline,
  calendarOutline, 
  funnelOutline,
  walletOutline,
  cashOutline,
  trendingUpOutline,
  giftOutline,
  swapVerticalOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonModal, IonPicker, IonPickerColumn, IonPickerColumnOption, FooterNavComponent]
})
export class RecordsPage {
  private router = inject(Router);
  public authService = inject(AuthService);

  selectedTab = 'statement';
  isLoading = false;
  isDateFilterOpen = false;
  activeDatePreset = 'today';
  selectedDateLabel = 'Today';
  isLogoVisible = true;

  startDate = '2026-05-02T12:00:00Z';
  endDate = '2026-05-02T12:00:00Z';

  // Picker Data
  years: number[] = [];
  months: string[] = [];
  days: string[] = [];

  startYear = 2026;
  startMonth = '05';
  startDay = '02';

  endYear = 2026;
  endMonth = '05';
  endDay = '02';

  // Mock Stats
  stats = {
    deposits: '0.00',
    withdrawals: '0.00',
    received: '0.00',
    betNumber: 0,
    validBets: '0.00',
    tax: '0.00',
    winLoss: '0.00'
  };

  constructor() {
    addIcons({ 
      chevronBackOutline, 
      chevronForwardOutline,
      chevronDownOutline,
      chevronUpOutline,
      syncOutline,
      closeOutline,
      calendarOutline, 
      funnelOutline,
      walletOutline,
      cashOutline,
      trendingUpOutline,
      giftOutline,
      swapVerticalOutline
    });
  }

  async ngOnInit() {
    // Subscribe to user changes so stats load even if auth is delayed
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadStats();
      }
    });

    // Initialize Picker Data
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      this.months.push(i.toString().padStart(2, '0'));
    }
    for (let i = 1; i <= 31; i++) {
      this.days.push(i.toString().padStart(2, '0'));
    }
  }

  async loadStats() {
    const user = this.authService.userSubject.value;
    if (user) {
      const realStats = await this.authService.fetchRecordStats(user.id);
      this.stats = {
        ...this.stats,
        ...realStats
      };
    }
  }

  toggleDateFilter(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isDateFilterOpen = !this.isDateFilterOpen;
  }

  selectPreset(preset: string) {
    this.activeDatePreset = preset;
    const now = new Date();
    if (preset === 'today') {
      this.startDate = now.toISOString();
      this.endDate = now.toISOString();
      this.selectedDateLabel = 'Today';
    } else if (preset === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      this.startDate = yesterday.toISOString();
      this.endDate = yesterday.toISOString();
      this.selectedDateLabel = 'Yesterday';
    }
    this.isDateFilterOpen = false;
  }

  confirmDate() {
    this.activeDatePreset = 'custom';
    
    this.startDate = `${this.startYear}-${this.startMonth}-${this.startDay}T12:00:00Z`;
    this.endDate = `${this.endYear}-${this.endMonth}-${this.endDay}T12:00:00Z`;

    const format = (y:any, m:any, d:any) => `${y}-${m}-${d}`;
    
    const sStr = format(this.startYear, this.startMonth, this.startDay);
    const eStr = format(this.endYear, this.endMonth, this.endDay);

    if (sStr === eStr) {
      this.selectedDateLabel = sStr;
    } else {
      this.selectedDateLabel = `${sStr} ~ ${eStr}`;
    }
    this.isDateFilterOpen = false;
  }

  async refreshBalance() {
    this.isLoading = true;
    const user = this.authService.userSubject.value;
    if (user) {
      await Promise.all([
        this.authService.refreshProfile(user.id),
        this.loadStats()
      ]);
    }
    setTimeout(() => this.isLoading = false, 800);
  }

  navigateToRetrieve() {
    this.selectedTab = 'retrieve';
  }

  hideLogo() {
    this.isLogoVisible = false;
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
