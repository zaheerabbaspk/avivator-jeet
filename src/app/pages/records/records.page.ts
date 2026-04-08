import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonModal, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  calendarOutline, 
  funnelOutline,
  walletOutline,
  cashOutline,
  trendingUpOutline,
  giftOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonModal, IonBadge, FooterNavComponent]
})
export class RecordsPage {
  private router = inject(Router);

  selectedSegment = 'all';
  selectedDate: string | null = null;
  isDatePickerOpen = false;

  records = [
    { id: 1, type: 'Deposit', amount: '500.00', date: '2024-04-09 10:30', status: 'Success', icon: 'cash-outline', color: '#00CFFF' },
    { id: 2, type: 'Bet', amount: '-100.00', date: '2024-04-09 09:15', status: 'Settled', icon: 'trending-up-outline', color: '#f7c04a' },
    { id: 3, type: 'Reward', amount: '50.00', date: '2024-04-08 22:45', status: 'Claimed', icon: 'gift-outline', color: '#d2fe07' },
    { id: 4, type: 'Withdraw', amount: '-200.00', date: '2024-04-08 14:20', status: 'Pending', icon: 'wallet-outline', color: '#ef4444' }
  ];

  constructor() {
    addIcons({ 
      chevronBackOutline, 
      calendarOutline, 
      funnelOutline,
      walletOutline,
      cashOutline,
      trendingUpOutline,
      giftOutline
    });
  }

  get filteredRecords() {
    let filtered = this.records;
    
    // Filter by category
    if (this.selectedSegment !== 'all') {
      filtered = filtered.filter(r => r.type.toLowerCase() === this.selectedSegment);
    }
    
    // Filter by date
    if (this.selectedDate) {
      const targetDate = this.selectedDate.split('T')[0]; // Format: YYYY-MM-DD
      filtered = filtered.filter(r => r.date.startsWith(targetDate));
    }
    
    return filtered;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.isDatePickerOpen = false;
  }

  clearDateFilter() {
    this.selectedDate = null;
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
