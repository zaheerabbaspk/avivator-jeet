import { Injectable } from '@angular/core';

export interface OfferCardData {
  id: string;
  brand: string;
  bannerImg: string;
  brandColor: string;
  logoLabel?: string;
  title?: string;
  subtitle?: string;
  amount?: string;
  hasShareButton?: boolean;
  badgeCount?: number;
  graphicImg?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  icon: string;
  type: 'daily' | 'weekly';
  progress: number;
  target: number;
}

export interface VipTier {
  lvl: number;
  label: string;
  promoBet: number;
  upgradeBonus: string;
  dailyBonus: string;
  weeklyBonus: string;
  monthlyBonus: string;
  isCurrent?: boolean;
}

export interface HistoryRecord {
  id: string;
  type: string;
  amount: string;
  date: string;
  status: 'Claimed' | 'Distributed';
  period: string; // Used for filtering
}

export interface UnclaimedSummary {
  total: string;
  categories: { label: string; value: string; icon: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private offers: OfferCardData[] = [
    {
      id: 'invitation-6',
      brand: 'No777.com',
      bannerImg: 'assets/offer_banner_6.png',
      brandColor: '#F1C15A',
      logoLabel: 'No777.com',
      title: 'Invitation Bonus 6',
      subtitle: 'Random mission rewards',
      amount: 'Rs 500',
      hasShareButton: true,
      badgeCount: 1,
      graphicImg: 'assets/games/wheel_mini.png'
    },
    {
      id: 'invitation-7',
      brand: 'No777.com',
      bannerImg: 'assets/offer_banner_7.png',
      brandColor: '#F1C15A',
      logoLabel: 'No777.com',
      title: 'Invitation Bonus 7',
      subtitle: 'Daily share your reward',
      amount: 'Rs 200',
      hasShareButton: true,
      badgeCount: 1
    },
    {
      id: 'invitation-8',
      brand: 'No777.com',
      bannerImg: 'assets/offer_banner_8.png',
      brandColor: '#F1C15A',
      logoLabel: 'No777.com',
      title: 'Invitation Bonus 8',
      subtitle: 'Weekly sharing get your reward',
      amount: 'Rs 1,000',
      hasShareButton: true,
      badgeCount: 1
    },
    {
      id: '788win',
      brand: '788win.com',
      bannerImg: 'assets/offer_banner_788.png',
      brandColor: '#ef4444',
      logoLabel: '788win.com',
      title: 'New Platform',
      subtitle: 'Invite 1 friends bonus',
      amount: 'Rs 5,000',
      badgeCount: 1
    },
    {
      id: '877bet',
      brand: '877bet.com',
      bannerImg: 'assets/offer_banner_vip.png',
      brandColor: '#4ade80',
      logoLabel: '877bet.com',
      title: 'New Platform',
      subtitle: 'Invite 1 friends bonus',
      amount: 'Rs 5,000',
      badgeCount: 1
    },
    {
      id: 'platform-5000-2',
      brand: 'No777.com',
      bannerImg: 'assets/offer_banner_788.png',
      brandColor: '#F1C15A',
      logoLabel: 'No777.com',
      badgeCount: 1,
      hasShareButton: true
    },
    {
      id: 'swipe-win',
      brand: 'No777.com',
      bannerImg: 'assets/main3.png',
      brandColor: '#F1C15A',
      logoLabel: 'No777.com',
      badgeCount: 1,
      hasShareButton: true
    },
    {
      id: 'whatsapp-channel',
      brand: 'No777.com',
      bannerImg: 'assets/main2.png',
      brandColor: '#4ade80',
      logoLabel: 'No777.com',
      title: 'WhatsApp Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'telegram-channel',
      brand: 'No777.com',
      bannerImg: 'assets/offer_banner_referral.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'brand-channel',
      brand: 'No777.com',
      bannerImg: 'assets/m.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'brand-channel1',
      brand: 'No777.com',
      bannerImg: 'assets/mm.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'brand-channel2',
      brand: 'No777.com',
      bannerImg: 'assets/mmm.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'brand-channel3',
      brand: 'No777.com',
      bannerImg: 'assets/mmm.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'brand-channel4',
      brand: 'No777.com',
      bannerImg: 'assets/mmmm.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'brand-channel6',
      brand: 'No777.com',
      bannerImg: 'assets/brand_bv999.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    },
    {
      id: 'brand-channel7',
      brand: 'No777.com',
      bannerImg: 'assets/main5.png',
      brandColor: '#0088cc',
      logoLabel: 'No777.com',
      title: 'Telegram Channel',
      subtitle: 'Click to follow the latest developments',
      amount: 'Social',
      badgeCount: 1
    }
  ];

  private missions: Mission[] = [
    { id: 'd1', title: 'Daily Login', description: 'Log in to the game today', reward: 'Rs 10.00', icon: 'calendar', type: 'daily', progress: 1, target: 1 },
    { id: 'd2', title: 'First Deposit', description: 'Make any deposit today', reward: 'Rs 50.00', icon: 'card', type: 'daily', progress: 0, target: 1 },
    { id: 'd3', title: 'Place 10 Bets', description: 'Place at least 10 bets in any game', reward: 'Rs 20.00', icon: 'gift', type: 'daily', progress: 4, target: 10 },
    { id: 'w1', title: 'Weekly Challenge', description: 'Win 50 rounds in Aviator', reward: 'Rs 500.00', icon: 'ribbon', type: 'weekly', progress: 12, target: 50 },
    { id: 'w2', title: 'Turnover Target', description: 'Reach 10,000 total turnover', reward: 'Rs 1000.00', icon: 'diamond', type: 'weekly', progress: 2500, target: 10000 },
  ];

  private history: HistoryRecord[] = [
    { id: 'h1', type: 'Mission Reward', amount: 'Rs 50.00', date: '2024-04-14 10:30', status: 'Claimed', period: 'Today' },
    { id: 'h2', type: 'VIP Upgrade', amount: 'Rs 100.00', date: '2024-04-13 15:45', status: 'Distributed', period: 'Yesterday' },
    { id: 'h3', type: 'Daily Cashback', amount: 'Rs 12.50', date: '2024-04-10 09:00', status: 'Claimed', period: 'Last Week' },
  ];

  private unclaimed: UnclaimedSummary = {
    total: 'Rs 152.00',
    categories: [
      { label: 'Mission Rewards', value: '50.00', icon: 'gift' },
      { label: 'VIP Cashback', value: '102.00', icon: 'diamond' }
    ]
  };

  getOffers() { return this.offers; }

  getMissions(type: 'daily' | 'weekly') {
    return this.missions.filter(m => m.type === type);
  }

  getVipTiers(): VipTier[] {
    return Array.from({ length: 51 }, (_, lvl) => {
      let bet = lvl * 50000;
      if (lvl === 0) bet = 0;
      else if (lvl === 1) bet = 10000;
      else if (lvl < 5) bet = lvl * 20000;

      let bonusMult = 100;
      if (lvl < 10) bonusMult = 50;
      else if (lvl >= 45) bonusMult = 1000;
      else if (lvl >= 30) bonusMult = 500;
      else if (lvl >= 20) bonusMult = 200;

      const bonus = lvl * bonusMult;

      return {
        lvl,
        label: lvl === 0 ? 'Remaining VIP1 Remaining bet≥9,922.12' : `Bet for promotion ${bet.toLocaleString()}`,
        promoBet: bet,
        upgradeBonus: bonus.toFixed(2),
        dailyBonus: (bonus * 0.02).toFixed(2),
        weeklyBonus: (bonus * 0.1).toFixed(2),
        monthlyBonus: (bonus * 0.25).toFixed(2),
        isCurrent: lvl === 0
      };
    });
  }

  getHistory(status: string = 'All', period: string = 'Today') {
    return this.history.filter(h => {
      const matchStatus = status === 'All' || h.status === status;
      const matchPeriod = period === 'Today' || h.period === period; // Simplified mock
      return matchStatus && matchPeriod;
    });
  }

  getUnclaimedSummary() { return this.unclaimed; }
}
