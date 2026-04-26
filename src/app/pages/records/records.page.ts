import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonModal } from '@ionic/angular/standalone';
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

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonModal, FooterNavComponent]
})
export class RecordsPage {
  private router = inject(Router);

  selectedTab = 'statement';
  isLoading = false;
  isDateFilterOpen = false;
  activeDatePreset = 'today';
  selectedDateLabel = 'Today';

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

  toggleDateFilter() {
    this.isDateFilterOpen = !this.isDateFilterOpen;
  }

  selectPreset(preset: string) {
    this.activeDatePreset = preset;
    this.selectedDateLabel = preset.charAt(0).toUpperCase() + preset.slice(1);
    this.isDateFilterOpen = false;
  }

  confirmDate() {
    if (this.activeDatePreset) {
      this.selectedDateLabel = this.activeDatePreset.charAt(0).toUpperCase() + this.activeDatePreset.slice(1);
    } else {
      this.selectedDateLabel = 'Custom';
    }
    this.isDateFilterOpen = false;
  }

  refreshBalance() {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }

  navigateToRetrieve() {
    this.selectedTab = 'retrieve';
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
