import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { walletOutline, notificationsOutline, star, flame, chevronForward, giftOutline, peopleOutline, headsetOutline, personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle, closeCircleOutline, cashOutline } from 'ionicons/icons';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthModalComponent } from '../components/auth-modal/auth-modal.component';
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';
import { RewardModalComponent } from '../components/reward-modal/reward-modal.component';
import { AuthService } from '../services/auth.service';
import { FooterNavComponent } from '../components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonBadge, CommonModule, AuthModalComponent, SuccessModalComponent, RewardModalComponent, FooterNavComponent],
})
export class HomePage {
  public router = inject(Router);
  private authService = inject(AuthService);

  isAuthModalOpen = false;
  isSuccessModalOpen = false;
  isRewardModalOpen = false;
  isLoggedIn = false;

  games = [
    { title: 'Aviator', provider: 'SPRIBE', image: 'assets/games/aviator_bg.png', route: '/crash-game', favorite: true, popular: true },
    { title: 'Dragon Tiger', provider: 'WG', image: 'assets/games/dragon_tiger_bg.png', route: null, favorite: true, popular: true },
    { title: 'Mines', provider: 'SPRIBE', image: 'assets/games/mines_bg.png', route: null, favorite: false, popular: false },
    { title: 'WG Crash', provider: 'WG', image: 'assets/games/rocket_bg.png', route: '/crash-game', favorite: true, popular: true },
    { title: 'JILI Slots', provider: 'JILI', image: 'assets/games/dragon_tiger_bg.png', route: null, favorite: false, popular: false },
    { title: 'Blockchain Games', provider: 'INOUT', image: 'assets/games/mines_bg.png', route: null, favorite: false, popular: false },
  ];

  constructor(private route: ActivatedRoute) {
    addIcons({ walletOutline, notificationsOutline, star, flame, chevronForward, giftOutline, peopleOutline, headsetOutline, personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle, closeCircleOutline, cashOutline });

    // Subscribe to auth state
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.isAuthModalOpen = false;
      } else {
        // Auto-open modal if not logged in (e.g., after splash)
        // setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => this.isAuthModalOpen = true, 500);
      }
    });

    // Check for triggers (e.g., coming back from a game)
    this.route.queryParams.subscribe(params => {
      if (params['showReward'] === 'true') {
        setTimeout(() => {
          this.isRewardModalOpen = true;
        }, 800);
      }
    });
  }


  handleAuthSuccess() {
    this.isAuthModalOpen = false;
    // Show reward modal after a brief delay on login/register
    setTimeout(() => {
      this.isRewardModalOpen = true;
    }, 500);
  }

  handleRewardDeposit(amount: number) {
    this.isRewardModalOpen = false;
    this.router.navigate(['/deposit'], { queryParams: { amount: amount } });
  }


  handleDeposit() {
    if (!this.isLoggedIn) {
      this.isAuthModalOpen = true;
      return;
    }
    this.router.navigate(['/deposit']);
  }

  navigateToGame(game: any) {
    if (!this.isLoggedIn) {
      this.isAuthModalOpen = true;
      return;
    }
    if (game.route) {
      this.router.navigate([game.route]);
    }
  }
}
