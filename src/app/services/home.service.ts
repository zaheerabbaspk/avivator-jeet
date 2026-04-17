import { Injectable, signal } from '@angular/core';

export interface Banner {
  id: string;
  image: string;
  link?: string;
}

export interface Brand {
  name: string;
  image: string;
  color: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Game {
  id: string;
  title: string;
  provider: string;
  image: string;
  route: string | null;
  popular: boolean;
  badge: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
  private bannerSlides = [
    'assets/m.png',
    'assets/main1.png',
    'assets/main2.png',
    'assets/mmmm.png',
    'assets/main5.png',
    'assets/mm.png',
    'assets/mmm.png',
    'assets/mmmmm.png',
  ];

  private brands: Brand[] = [
    { name: 'BV999', image: 'assets/brand_bv999.png', color: '#4ade80' },
    { name: 'AR999', image: 'assets/brand_ar999.png', color: '#ef4444' },
    { name: 'CZ777', image: 'assets/brand_cz777.png', color: '#c084fc' },
    { name: 'WC777', image: 'assets/brand_bv999.png', color: '#4ade80' },
    { name: 'ZC777', image: 'assets/brand_ar999.png', color: '#ef4444' },
    { name: 'NO777', image: 'assets/brand_cz777.png', color: '#f5c518' },
  ];

  private categories: Category[] = [
    { id: 'hot', label: 'Hot', icon: 'assets/icon_dtfl_rm_1.avif' },
    { id: 'slot', label: 'Slot', icon: 'assets/icon_dtfl_dz_1.avif' },
    { id: 'blockchain', label: 'Blockchain', icon: 'assets/icon_dtfl_qkl_1.avif' },
    { id: 'cards', label: 'Cards', icon: 'assets/icon_dtfl_qp_1.avif' },
    { id: 'fishing', label: 'Fishing', icon: 'assets/icon_dtfl_by_1.avif' },
    { id: 'live', label: 'Live', icon: 'assets/icon_dtfl_cp_1.avif' },
  ];

  private games: Game[] = [
    { id: '1', title: 'Aviator', provider: 'Spribe', image: 'assets/avi.png', route: '/crash-game', popular: true, badge: 'HOT', category: 'hot' },
    { id: '2', title: 'Lucky 7', provider: 'Evolution', image: 'assets/avi5.png', route: null, popular: true, badge: '', category: 'hot' },
    { id: '3', title: 'Crash', provider: 'Spribe', image: 'assets/avi.png', route: '/crash-game', popular: true, badge: '', category: 'hot' },
    { id: '4', title: 'Fruit Ninja', provider: 'GameArt', image: 'assets/avi1.png', route: null, popular: true, badge: 'NEW', category: 'hot' },
    { id: '5', title: 'Poker Master', provider: 'Playtech', image: 'assets/avi2.png', route: null, popular: false, badge: '', category: 'cards' },
    { id: '6', title: 'Deep Sea Fishing', provider: 'Microgaming', image: 'assets/avi4.png', route: null, popular: false, badge: '', category: 'fishing' },
  ];

  constructor() { }

  getBanners() {
    return this.bannerSlides;
  }

  getBrands() {
    return this.brands;
  }

  getCategories() {
    return this.categories;
  }

  getPopularGames() {
    return this.games.filter(g => g.popular);
  }

  getGamesByCategory(categoryId: string) {
    if (categoryId === 'hot') return this.games;
    return this.games.filter(g => g.category === categoryId);
  }

  getAllGames() {
    return this.games;
  }
}
