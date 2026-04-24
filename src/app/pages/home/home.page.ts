import { Component, computed, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronUpOutline, starOutline, giftOutline, peopleOutline,
  headsetOutline, personOutline, lockClosedOutline, eyeOutline,
  eyeOffOutline, logoGoogle, closeCircleOutline, reloadOutline, caretDown,
  flame, cube, apps, albums, videocam, football, closeOutline, close,
  logoFacebook, logoWhatsapp, paperPlane
} from 'ionicons/icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';
import { RewardModalComponent } from '../../components/reward-modal/reward-modal.component';
import { AuthService } from '../../services/auth.service';
import { HomeService, Brand, Category, Game } from '../../services/home.service';
import { ImageCacheService } from '../../services/image-cache.service';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { HomeBannersComponent } from '../../components/home-banners/home-banners.component';
import { HomeBrandsComponent } from '../../components/home-brands/home-brands.component';
import { HomeAnnounceComponent } from '../../components/home-announce/home-announce.component';
import { HomeCategoriesComponent } from '../../components/home-categories/home-categories.component';
import { HomeGameGridComponent } from '../../components/home-game-grid/home-game-grid.component';
import { BonusRainModalComponent } from '../../components/bonus-rain-modal/bonus-rain-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonContent, IonIcon, CommonModule,
    AuthModalComponent, SuccessModalComponent, RewardModalComponent, FooterNavComponent,
    HomeHeaderComponent, HomeBannersComponent, HomeBrandsComponent,
    HomeAnnounceComponent, HomeCategoriesComponent, HomeGameGridComponent,
    BonusRainModalComponent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  public router = inject(Router);
  private authService = inject(AuthService);
  private homeService = inject(HomeService);
  private imageCache = inject(ImageCacheService);

  isAuthModalOpen = false;
  authMode: 'login' | 'register' = 'register';
  isSuccessModalOpen = false;
  isRewardModalOpen = false;
  isBonusRainOpen = false;
  isLoggedIn = false;
  userBalance = 0.00;
  isLoadingBalance = false;

  activeCategory = signal('hot');
  isScrolling = signal(false);
  private scrollTimeout: any;

  onContentScroll(event: any) {
    if (!this.isScrolling()) {
      this.isScrolling.set(true);
    }

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      this.isScrolling.set(false);
    }, 400); // Return faster (400ms)
  }

  // Floating Widgets State
  public leftWidgets = [
    { id: 'l1', src: 'https://140.150.30.128:5030/common/upload/1976544747410857985.avif', visible: true },
    { id: 'l2', src: 'https://140.150.30.128:5030/common/upload/1976544789514620930.avif', visible: true },
    { id: 'l3', src: 'https://140.150.30.128:5030/common/upload/1976544914506809346.avif', visible: true }
  ];

  public rightWidgets = [
    { id: 'r1', src: 'https://140.150.30.128:5030/common/upload/1976985402893504513.avif', visible: true },
    { id: 'r2', src: 'https://140.150.30.128:5030/common/upload/1976986603810435074.avif', visible: true },
    { id: 'r3', src: 'https://140.150.30.128:5030/common/upload/1976986720843702274.avif', visible: true }
  ];

  // Data derived from HomeService
  bannerSlides: string[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];

  // Filtering Logic
  filteredGames = computed(() => {
    return this.homeService.getGamesByCategory(this.activeCategory());
  });

  constructor(private route: ActivatedRoute) {
    addIcons({
      reloadOutline, caretDown, chevronUpOutline, starOutline, giftOutline,
      peopleOutline, headsetOutline, personOutline, lockClosedOutline,
      eyeOutline, eyeOffOutline, logoGoogle, closeCircleOutline,
      flame, cube, apps, albums, videocam, football, closeOutline, close,
      logoFacebook, logoWhatsapp, paperPlane
    });

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (!loggedIn) {
        setTimeout(() => this.isAuthModalOpen = true, 500);
      }
    });

    this.authService.balance$.subscribe(bal => {
      this.userBalance = bal;
    });

    this.route.queryParams.subscribe(params => {
      if (params['showReward'] === 'true') {
        setTimeout(() => { this.isRewardModalOpen = true; }, 800);
      }
      if (params['showBonus'] === 'true') {
        setTimeout(() => { this.isBonusRainOpen = true; }, 500);
      }
    });
  }

  hideWidget(widget: any, event: Event) {
    event.stopPropagation();
    widget.visible = false;
  }

  async ngOnInit() {
    this.loadData();
    
    // Cache the floating widget images to LocalStorage
    for (let widget of this.leftWidgets) {
      widget.src = await this.imageCache.getCachedImage(widget.src);
    }
    for (let widget of this.rightWidgets) {
      widget.src = await this.imageCache.getCachedImage(widget.src);
    }

    // Check if we should show bonus rain on app open
    // Using a longer timeout to ensure UI is ready
    setTimeout(() => {
      if (this.isLoggedIn || this.router.url.includes('showBonus=true')) {
        this.isBonusRainOpen = true;
      }
    }, 2000);
  }

  ngOnDestroy() {
  }

  private loadData() {
    this.bannerSlides = this.homeService.getBanners();
    this.brands = this.homeService.getBrands();
    this.categories = this.homeService.getCategories();
  }

  handleCategoryChange(catId: string) {
    this.activeCategory.set(catId);
  }

  handleLogin(mode: 'login' | 'register') {
    this.authMode = mode;
    this.isAuthModalOpen = true;
  }

  handleAuthSuccess() {
    this.isAuthModalOpen = false;
    setTimeout(() => {
      this.isSuccessModalOpen = true;
      // Trigger Bonus Rain after success for demo
      setTimeout(() => { this.isBonusRainOpen = true; }, 2000);
    }, 500);
  }

  handleBonusOpen() {
    console.log('Bonus Opened!');
    // Removed: this.isBonusRainOpen = false; 
    // The modal should stay open to show the reward result.
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
    this.activeCategory.set('hot');
  }
}
