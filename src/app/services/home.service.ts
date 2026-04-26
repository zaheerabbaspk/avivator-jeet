import { Injectable } from '@angular/core';
import { ImageCacheService } from './image-cache.service';

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
    { id: 'hot', label: 'Hot', icon: 'https://140.150.30.128:5030/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_rm_1.avif?manualVersion=1&version=d8102e6ae1' },
    { id: 'blockchain', label: 'Blockchain', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_qkl_1.avif?manualVersion=1&version=ae3b8216e5' },
    { id: 'slot', label: 'Slot', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_dz_1.avif?manualVersion=1&version=12588989f7' },
    { id: 'cards', label: 'Cards', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_qp_1.avif?manualVersion=1&version=9b85d5fd9e' },
    { id: 'fishing', label: 'Fishing', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_by_1.avif?manualVersion=1&version=b8445639f9' },
    { id: 'live', label: 'Live', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_ty_1.avif?manualVersion=1&version=9d860d19e0' },
  ];

  private games: Game[] = [
    { id: '1', title: 'Game 16', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/312/11/custom_PKR.avif?p=1776173589', route: '/crash-game', popular: true, badge: '', category: 'hot' },
    { id: '2', title: 'Game 2', provider: 'Casino', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/315/3/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: '', category: 'hot' },
    { id: '3', title: 'Game 3', provider: 'Casino', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/1014/5/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: '', category: 'hot' },
    { id: '4', title: 'Game 4', provider: 'Casino', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/hot/315/1/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: '', category: 'hot' },
    { id: '5', title: 'Game 5', provider: 'Casino', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/200/3/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: '', category: 'hot' },
    { id: '6', title: 'Game 6', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/118/2/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '7', title: 'Game 7', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/200/3/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '8', title: 'Game 8', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/13/11/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '9', title: 'Game 9', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/47/5/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '10', title: 'Game 10', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/56/1/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '11', title: 'Game 11', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/75/4/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '12', title: 'Game 12', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/86/1/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '13', title: 'Game 13', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/95/11/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '14', title: 'Game 14', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/301/4/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '15', title: 'Game 15', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/310/3/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '16', title: 'Game 1', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/315/3/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '17', title: 'Game 17', provider: 'Casino', image: 'https://140.150.30.128:5030/game_pictures/g/EA/315/3/3150051/default.avif?g0=1776048611', route: null, popular: true, badge: '', category: 'hot' },
    { id: '18', title: 'Game 18', provider: 'Casino', image: 'https://140.150.30.128:5030/game_pictures/g/EA/366/11/3660003/default.avif?g0=1776048611', route: null, popular: true, badge: '', category: 'hot' },
    { id: '19', title: 'Aviator', provider: 'SPRIBE', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/312/11/custom_PKR.avif?p=1776666654', route: '/crash-game', popular: true, badge: 'Spribe Blockchain', category: 'blockchain' },
    { id: '20', title: 'Aviator WG', provider: 'WG', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/366/11/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: 'WG Blockchain', category: 'blockchain' },
    { id: '21', title: 'Chicken Road', provider: 'INOUT', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/314/11/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: 'INOUT Blockchain', category: 'blockchain' },
    { id: '22', title: 'GoRush', provider: 'JILI', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/95/11/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: 'JILI Blockchain', category: 'blockchain' },
    { id: '23', title: 'Mines', provider: 'TB', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/200/3/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: 'TB Blockchain', category: 'blockchain' },
    { id: '24', title: 'Crash', provider: 'TI', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/13/11/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: 'TI Blockchain', category: 'blockchain' },
    { id: '25', title: 'Money Coming', provider: 'JILI', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/47/5/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: '', category: 'hot' },
    { id: '26', title: 'Chicken Road 2', provider: 'INOUT', image: 'https://140.150.30.128:5030/game_pictures/p/2557/EA/315/1/custom_PKR.avif?p=1776666654', route: null, popular: true, badge: '', category: 'hot' },
    { id: '27', title: 'Slot Rush', provider: 'PG', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/312/11/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'slot' },
    { id: '28', title: 'Super Jili', provider: 'JILI', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/118/2/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'slot' },
    { id: '29', title: 'Fish Hunter', provider: 'JILI', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/314/11/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'fishing' },
    { id: '30', title: 'Live Roulette', provider: 'EVO', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/200/3/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'live' },
    { id: '31', title: 'Game 31', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/13/11/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '32', title: 'Game 32', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/47/5/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '33', title: 'Game 33', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/56/1/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '34', title: 'Game 34', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/75/4/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '35', title: 'Game 35', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/86/1/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '36', title: 'Game 36', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/95/11/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '37', title: 'Game 37', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/301/4/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '38', title: 'Game 38', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/310/3/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '39', title: 'Game 39', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/315/3/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
    { id: '40', title: 'Game 40', provider: 'Casino', image: 'https://www.sk777vip2.bet/game_pictures/p/2961/EA/315/3/custom_PKR.avif?p=1776173589', route: null, popular: true, badge: '', category: 'hot' },
  ];

  constructor(private imageCache: ImageCacheService) {
    this.initCache();
  }

  private async initCache() {
    for (let game of this.games) {
      if (game.image) {
        game.image = await this.imageCache.getCachedImage(game.image);
      }
    }
  }

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
