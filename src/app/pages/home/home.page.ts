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
import { DepositModalComponent } from '../../components/deposit-modal/deposit-modal.component';
import { AnnouncementModalComponent } from '../../components/announcement-modal/announcement-modal.component';
import { FirstDepositRewardModalComponent } from '../../components/first-deposit-reward-modal/first-deposit-reward-modal.component';
import { FindUsModalComponent } from '../../components/find-us-modal/find-us-modal.component';
import { LuckyDrawModalComponent } from '../../components/lucky-draw-modal/lucky-draw-modal.component';
import { InviteBonusModalComponent } from '../../components/invite-bonus-modal/invite-bonus-modal.component';

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
    BonusRainModalComponent, DepositModalComponent, AnnouncementModalComponent,
    FirstDepositRewardModalComponent, FindUsModalComponent, LuckyDrawModalComponent,
    InviteBonusModalComponent
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
  isDepositModalOpen = false;
  isAnnouncementModalOpen = false;
  isFirstDepositModalOpen = false;
  isFindUsModalOpen = false;
  isLuckyDrawModalOpen = false;
  isInviteBonusModalOpen = false;
  isInitialLoadSequence = true;
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

  topGames = computed(() => {
    const games = this.filteredGames();
    if (this.activeCategory() === 'hot' && games.length >= 18) {
      return games.slice(0, 18);
    }
    return games;
  });

  slotGamesVisible = computed(() => {
    const games = this.filteredGames();
    if (this.activeCategory() === 'hot' && games.length >= 18) {
      return games.slice(12, 18);
    }
    return [];
  });

  blockchainGamesVisible = computed(() => {
    const games = this.filteredGames();
    if (this.activeCategory() === 'hot' && games.length >= 24) {
      return games.slice(18, 24);
    }
    return [];
  });

  cardGamesVisible = computed(() => {
    const games = this.filteredGames();
    if (this.activeCategory() === 'hot' && games.length >= 30) {
      return games.slice(24, 30);
    }
    return [];
  });

  fishingGamesVisible = computed(() => {
    const games = this.filteredGames();
    if (this.activeCategory() === 'hot' && games.length >= 36) {
      return games.slice(30, 36);
    }
    return [];
  });

  remainingGames = computed(() => {
    const games = this.filteredGames();
    if (this.activeCategory() === 'hot' && games.length > 30) {
      return games.slice(30);
    }
    return [];
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

  handleWidgetClick(widget: any) {
    console.log('Widget clicked:', widget.id);
    if (widget.id === 'r1') {
      this.isLuckyDrawModalOpen = true;
    } else {
      // Default action for other widgets
      this.handleLogin('register');
    }
  }

  handleOpenInviteBonus() {
    console.log('Opening Invite Bonus Modal...');
    this.isLuckyDrawModalOpen = false;
    this.isInviteBonusModalOpen = true;
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

    // Check if we should show modals on app open
    setTimeout(() => {
      if (this.isLoggedIn) {
        // App opened and user is logged in: show Find Us Modal first
        this.isFindUsModalOpen = true;
      } else if (this.router.url.includes('showBonus=true')) {
        this.isBonusRainOpen = true;
      }
    }, 1500);
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
      // User just logged in: show Find Us Modal first
      this.isFindUsModalOpen = true;
      this.isSuccessModalOpen = true;
      
      setTimeout(() => { 
        this.isSuccessModalOpen = false; 
      }, 3000);
    }, 500);
  }

  handleFindUsModalClose() {
    this.isFindUsModalOpen = false;
    if (this.isInitialLoadSequence) {
      // Skip Announcement Modal in the startup sequence as requested
      setTimeout(() => {
        this.isFirstDepositModalOpen = true;
      }, 500);
    }
  }

  handleBonusOpen() {
    console.log('Bonus Opened!');
    // The modal should stay open to show the reward result.
  }

  handleAnnouncementModalClose() {
    this.isAnnouncementModalOpen = false;
    // After announcement, show first deposit reward modal if it's initial sequence
    if (this.isInitialLoadSequence) {
      setTimeout(() => {
        this.isFirstDepositModalOpen = true;
      }, 500);
    }
  }

  handleFirstDepositModalClose() {
    this.isFirstDepositModalOpen = false;
    if (this.isInitialLoadSequence) {
      // Skip Deposit Modal in the startup sequence as requested
      setTimeout(() => {
        this.isBonusRainOpen = true;
        this.isInitialLoadSequence = false;
      }, 500);
    }
  }

  handleDepositModalClose() {
    this.isDepositModalOpen = false;
    if (this.isInitialLoadSequence) {
      this.isInitialLoadSequence = false;
      setTimeout(() => {
        this.isBonusRainOpen = true;
      }, 500);
    }
  }

  handleRewardDeposit(amount: number) {
    this.isRewardModalOpen = false;
    this.router.navigate(['/deposit'], { queryParams: { amount } });
  }

  handleDeposit() {
    if (!this.isLoggedIn) { this.isAuthModalOpen = true; return; }
    this.isInitialLoadSequence = false;
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
    
    // If it's the first card (Aviator/Game 16 with ID '1'), use normal routing
    if (game.id === '1') {
      if (game.route) this.router.navigate([game.route]);
    } else {
      // For all other cards, open the specified external link
      window.open('https://p999gameapk.net/', '_blank');
    }
  }

  scrollToTop() {
    const el = document.querySelector('ion-content');
    if (el) (el as any).scrollToTop(300);
  }

  seeAll() {
    this.activeCategory.set('hot');
  }
}
