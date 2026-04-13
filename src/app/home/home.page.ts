import { Component, computed, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronUpOutline, starOutline, giftOutline, peopleOutline,
  headsetOutline, personOutline, lockClosedOutline, eyeOutline,
  eyeOffOutline, logoGoogle, closeCircleOutline, reloadOutline, caretDown,
  flame, cube, apps, albums, videocam, football
} from 'ionicons/icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthModalComponent } from '../components/auth-modal/auth-modal.component';
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';
import { RewardModalComponent } from '../components/reward-modal/reward-modal.component';
import { AuthService } from '../services/auth.service';
import { FooterNavComponent } from '../components/footer-nav/footer-nav.component';

export interface OfferCard {
  id: string;
  brand: string;   // used for alt text
  bannerImg: string;   // full card image banner
  brandColor: string;   // used for card border
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonContent, IonIcon, CommonModule,
    AuthModalComponent, SuccessModalComponent, RewardModalComponent, FooterNavComponent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  public router = inject(Router);
  private authService = inject(AuthService);

  isAuthModalOpen = false;
  isSuccessModalOpen = false;
  isRewardModalOpen = false;
  isLoggedIn = false;
  userBalance = 0.00;
  isLoadingBalance = false;

  activeCategory = 'hot';

  // Banner Swiper
  bannerSlides = [
    'assets/m.png',
    'assets/main1.png',
    'assets/main2.png',
    'assets/mmmm.png',
    'assets/main5.png',
    'assets/mm.png',
    'assets/mmm.png',
    'assets/mmmmm.png',
  ];
  currentSlide = 0;
  private slideTimer: any;

  // Brand Swiper
  currentBrandSlide = 0;
  private brandTimer: any;

  brands = [
    { name: 'BV999', image: 'assets/brand_bv999.png', color: '#4ade80' },
    { name: 'AR999', image: 'assets/brand_ar999.png', color: '#ef4444' },
    { name: 'CZ777', image: 'assets/brand_cz777.png', color: '#c084fc' },
    { name: 'WC777', image: 'assets/brand_bv999.png', color: '#4ade80' },
    { name: 'ZC777', image: 'assets/brand_ar999.png', color: '#ef4444' },
    { name: 'NO777', image: 'assets/brand_cz777.png', color: '#f5c518' },
  ];



  categories = [
    { id: 'hot', label: 'Hot', icon: 'assets/icon_dtfl_rm_1.avif' },
    { id: 'slot', label: 'Slot', icon: 'assets/icon_dtfl_dz_1.avif' },
    { id: 'blockchain', label: 'Blockchain', icon: 'assets/icon_dtfl_qkl_1.avif' },
    { id: 'cards', label: 'Cards', icon: 'assets/icon_dtfl_qp_1.avif' },
    { id: 'fishing', label: 'Fishing', icon: 'assets/icon_dtfl_by_1.avif' },
    { id: 'live', label: 'Live', icon: 'assets/icon_dtfl_cp_1.avif' },
  ];

  games = [
    { title: '', provider: '', image: 'assets/avi.png', route: '/crash-game', popular: true, badge: '', category: '' },
    { title: '', provider: '', image: 'assets/avi5.png', route: null, popular: true, badge: '', category: '' },
    { title: '', provider: '', image: 'assets/avi.png', route: '/crash-game', popular: true, badge: '', category: '' },
    { title: '', provider: '', image: 'assets/avi1.png', route: null, popular: true, badge: '', category: '' },
    { title: '', provider: '', image: 'assets/avi2.png', route: null, popular: false, badge: '', category: '' },
    { title: '', provider: '', image: 'assets/avi4.png', route: null, popular: false, badge: '', category: '' },
  ];

  filteredGames = computed(() => {
    if (this.activeCategory === 'hot') return this.games;
    return this.games.filter(g => g.category === this.activeCategory);
  });

  ngOnInit() {
    this.slideTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.bannerSlides.length;
    }, 2000);
    this.brandTimer = setInterval(() => {
      this.currentBrandSlide = (this.currentBrandSlide + 1) % (this.brands.length - 2);
    }, 3000);
  }

  ngOnDestroy() {
    if (this.slideTimer) clearInterval(this.slideTimer);
    if (this.brandTimer) clearInterval(this.brandTimer);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    if (this.slideTimer) clearInterval(this.slideTimer);
    this.slideTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.bannerSlides.length;
    }, 2000);
  }

  goBrandSlide(index: number) {
    const maxIndex = this.brands.length - 3;
    this.currentBrandSlide = index > maxIndex ? maxIndex : index;
    if (this.brandTimer) clearInterval(this.brandTimer);
    this.brandTimer = setInterval(() => {
      this.currentBrandSlide = (this.currentBrandSlide + 1) % (this.brands.length - 2);
    }, 3000);
  }

  constructor(private route: ActivatedRoute) {
    addIcons({
      reloadOutline, caretDown, chevronUpOutline, starOutline, giftOutline,
      peopleOutline, headsetOutline, personOutline, lockClosedOutline,
      eyeOutline, eyeOffOutline, logoGoogle, closeCircleOutline,
      flame, cube, apps, albums, videocam, football
    });

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (!loggedIn) {
        setTimeout(() => this.isAuthModalOpen = true, 500);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['showReward'] === 'true') {
        setTimeout(() => { this.isRewardModalOpen = true; }, 800);
      }
    });
  }

  handleAuthSuccess() {
    this.isAuthModalOpen = false;
    setTimeout(() => { this.isRewardModalOpen = true; }, 500);
  }

  handleRewardDeposit(amount: number) {
    this.isRewardModalOpen = false;
    this.router.navigate(['/deposit'], { queryParams: { amount } });
  }

  handleDeposit() {
    if (!this.isLoggedIn) { this.isAuthModalOpen = true; return; }
    this.router.navigate(['/deposit']);
  }

  refreshBalance() {
    if (this.isLoadingBalance) return;
    this.isLoadingBalance = true;
    setTimeout(() => {
      this.isLoadingBalance = false;
    }, 1500);
  }

  navigateToGame(game: any) {
    if (!this.isLoggedIn) { this.isAuthModalOpen = true; return; }
    if (game.route) this.router.navigate([game.route]);
  }

  scrollToTop() {
    const el = document.querySelector('ion-content');
    if (el) (el as any).scrollToTop(300);
  }

  seeAll() {
    this.activeCategory = 'hot';
  }
}
