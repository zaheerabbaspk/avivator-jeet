import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCheckbox } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  giftOutline, 
  refreshOutline, 
  walletOutline,
  chevronForwardOutline,
  headsetOutline,
  documentTextOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { TreasureModalComponent } from '../../components/treasure-modal/treasure-modal.component';

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
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonIcon, 
    IonCheckbox, 
    FooterNavComponent,
    TreasureModalComponent
  ]
})
export class OffersPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  rewards = [
    { target: 100, reward: 50.00, progress: 0 },
    { target: 300, reward: 57.00, progress: 0 },
    { target: 500, reward: 77.00, progress: 0 },
    { target: 1000, reward: 117.00, progress: 0 },
    { target: 3000, reward: 177.00, progress: 0 },
    { target: 10000, reward: 477.00, progress: 0 },
    { target: 50000, reward: 2777.00, progress: 0 },
  ];

  isTreasureModalOpen = false;

  constructor() {
    addIcons({ 
      chevronBackOutline, 
      giftOutline, 
      refreshOutline, 
      walletOutline,
      chevronForwardOutline,
      headsetOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
    // Show treasure modal automatically when page opens
    setTimeout(() => {
      this.showTreasure();
    }, 800);

    // Also handle query parameters if needed for specific triggers
    this.route.queryParams.subscribe(params => {
      if (params['showTreasure'] === 'true') {
        this.showTreasure();
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  navigateToDeposit(amount: number) {
    this.router.navigate(['/deposit'], { queryParams: { amount: amount } });
  }

  handleSupport() {
    // Navigate to support
  }

  handleRecords() {
    // Navigate to records
  }

  showTreasure() {
    this.isTreasureModalOpen = true;
  }
}
