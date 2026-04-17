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
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';
import { RewardModalComponent } from '../../components/reward-modal/reward-modal.component';
import { AuthService } from '../../services/auth.service';
import { HomeService, Brand, Category, Game } from '../../services/home.service';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { HomeBannersComponent } from '../../components/home-banners/home-banners.component';
import { HomeBrandsComponent } from '../../components/home-brands/home-brands.component';
import { HomeAnnounceComponent } from '../../components/home-announce/home-announce.component';
import { HomeCategoriesComponent } from '../../components/home-categories/home-categories.component';
import { HomeGameGridComponent } from '../../components/home-game-grid/home-game-grid.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonContent, IonIcon, CommonModule,
    AuthModalComponent, SuccessModalComponent, RewardModalComponent, FooterNavComponent,
    HomeHeaderComponent, HomeBannersComponent, HomeBrandsComponent,
    HomeAnnounceComponent, HomeCategoriesComponent, HomeGameGridComponent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  public router = inject(Router);
  private authService = inject(AuthService);
  private homeService = inject(HomeService);

  isAuthModalOpen = false;
  authMode: 'login' | 'register' = 'register';
  isSuccessModalOpen = false;
  isRewardModalOpen = false;
  isLoggedIn = false;
  userBalance = 0.00;
  isLoadingBalance = false;

  activeCategory = signal('hot');

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

  ngOnInit() {
    this.loadData();
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
    setTimeout(() => { this.isSuccessModalOpen = true; }, 500);
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
