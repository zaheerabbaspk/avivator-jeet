import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface MenuAction {
  id: string;
  label: string;
  icon: string;
}

export interface OfferCard {
  id: string;
  label: string;
  icon: string;
  bgColor: string;
  badge?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  private categories: MenuCategory[] = [
    { id: 'hot', label: 'Hot', icon: 'https://140.150.30.128:5030/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_rm_1.avif?manualVersion=1&version=d8102e6ae1', color: '#ff4d4d' },
    { id: 'slot', label: 'Slot', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_dz_1.avif?manualVersion=1&version=12588989f7', color: '#ffd700' },
    { id: 'blockchain', label: 'Blockchain', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_qkl_1.avif?manualVersion=1&version=ae3b8216e5', color: '#00ccff' },
    { id: 'cards', label: 'Cards', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_qp_1.avif?manualVersion=1&version=9b85d5fd9e', color: '#c084fc' },
    { id: 'fishing', label: 'Fishing', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_by_1.avif?manualVersion=1&version=b8445639f9', color: '#4ade80' },
    { id: 'live', label: 'Live', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/_sprite/icon_dtfl_ty_1.avif?manualVersion=1&version=9d860d19e0', color: '#ff4d4d' },
    { id: 'fishing', label: 'Fishing', icon: 'fish', color: '#3b82f6' },
    { id: 'recent', label: 'Recent', icon: 'time', color: '#3b82f6' },
    { id: 'favorites', label: 'Favorites', icon: 'star', color: '#eab308' },
  ];

  private actions: MenuAction[] = [
    { id: 'record', label: 'Bet record', icon: 'wallet' },
    { id: 'share', label: 'Share', icon: 'share' },
    { id: 'invite', label: 'Invite', icon: 'people' },
  ];

  private offers: OfferCard[] = [
    { id: 'event', label: 'Event', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/common/btn_sy_zc_hd_1.avif?manualVersion=1&version=b0fb1a3f7d', bgColor: 'transparent', badge: 3 },
    { id: 'mission', label: 'Mission', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/common/btn_sy_zc_rw_1.avif?manualVersion=1&version=056c16d6dc', bgColor: 'transparent' },
    { id: 'vip', label: 'VIP', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/common/btn_sy_zc_vip_1.avif?manualVersion=1&version=563ec70066', bgColor: 'transparent' },
    { id: 'unclaimed', label: 'Unclaim<br>ed', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/common/btn_sy_zc_lqjl_1.avif?manualVersion=1&version=4f714272a2', bgColor: 'transparent' },
    { id: 'history', label: 'History', icon: 'https://www.sk777vip2.bet/siteadmin/skin/lobby_asset/2-1-common/common/common/btn_sy_zc_jl_1.avif?manualVersion=1&version=d5582a6656', bgColor: 'transparent' },
  ];

  private footerLinks: MenuAction[] = [
    { id: 'download', label: 'APP Download', icon: 'download' },
    { id: 'support', label: 'Customer Service', icon: 'headset' },
    { id: 'faq', label: 'FAQ', icon: 'help-circle' },
  ];

  private menuOpenSubject = new BehaviorSubject<boolean>(false);
  public menuOpen$ = this.menuOpenSubject.asObservable();

  setMenuState(isOpen: boolean) {
    this.menuOpenSubject.next(isOpen);
  }

  constructor() { }

  getCategories() { return this.categories; }
  getActions() { return this.actions; }
  getOffers() { return this.offers; }
  getFooterLinks() { return this.footerLinks; }
}
