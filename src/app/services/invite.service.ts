import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

export interface AgentStats {
  account: string;
  auditNumber: string;
  mode: string;
  settlementDate: string;
}

export interface InviteStats {
  totalEarnings: string;
  cumulativeInvitees: number;
}

export interface CommissionCard {
  title: string;
  subtitle?: string;
  stats: { label: string; value: string }[];
  reward: string;
  claimedBalance: string;
  unclaimedBalance: string;
}

export interface StatItem {
  label: string;
  value: string;
  isYellow?: boolean;
}

export interface MyDataStats {
  subordinateStats: StatItem[];
  revenueStats: StatItem[];
  allDataStats: StatItem[][];
  totalIncomeStats: StatItem[][];
}

export interface InviteBanner {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  imgUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private authService = inject(AuthService);

  private agentStatsSubject = new BehaviorSubject<AgentStats>({
    account: '---',
    auditNumber: '1.00',
    mode: 'Infinite range',
    settlementDate: new Date().toLocaleDateString('en-GB')
  });

  agentStats$ = this.agentStatsSubject.asObservable();

  private inviteStats: InviteStats = {
    totalEarnings: '0.00',
    cumulativeInvitees: 0
  };

  private banners: InviteBanner[] = [
    {
      id: 'b0',
      title: 'Invitation Bonus 1',
      subtitle: 'Invite friends bonus',
      amount: 'Rs 5,000',
      imgUrl: '/assets/invite1.png'
    },
    {
      id: 'b1',
      title: 'Invitation Bonus 2',
      subtitle: 'Cards/Fishing/live/Sports Special invitation reward',
      amount: 'Rs 1,000',
      imgUrl: '/assets/invite7.png'
    },
    {
      id: 'b3',
      title: 'Invitation Bonus 4',
      subtitle: 'Cricket/Sports Special promotion',
      amount: 'Rs 5,000',
      imgUrl: '/assets/invite2.png'
    },
    {
      id: 'b2',
      title: 'Invite Friends',
      subtitle: 'Share your code and get rewards',
      amount: 'Rs 2,000',
      imgUrl: '/assets/invite3.png' // Fallback to pilot for generic invite
    },

    {
      id: 'b2',
      title: 'Invite Friends',
      subtitle: 'Share your code and get rewards',
      amount: 'Rs 2,000',
      imgUrl: '/assets/invite.png' // Fallback to pilot for generic invite
    },
    {
      id: 'b2',
      title: 'Invite Friends',
      subtitle: 'Share your code and get rewards',
      amount: 'Rs 2,000',
      imgUrl: 'assets/invite6.png' // Fallback to pilot for generic invite
    },
    {
      id: 'b2',
      title: 'Invite Friends',
      subtitle: 'Share your code and get rewards',
      amount: 'Rs 2,000',
      imgUrl: 'assets/invite7.png' // Fallback to pilot for generic invite
    },
  ];

  private commissions: CommissionCard[] = [
    {
      title: 'Commission',
      subtitle: '(Time until next settlement 0 day(s) 00:45:01)',
      stats: [
        { label: "Yesterday's direct results", value: '0.00' },
        { label: 'Total Commission', value: '0.00' }
      ],
      reward: '0.00',
      claimedBalance: '0.00',
      unclaimedBalance: '0.00'
    },
    {
      title: 'Daily Invitation Reward Rs 5',
      stats: [
        { label: 'Invite valid number of people', value: '0' },
        { label: 'Reward', value: '5.00' }
      ],
      reward: '5.00',
      claimedBalance: '0.00',
      unclaimedBalance: '5.00'
    }
  ];

  constructor() {
    // Sync with auth profile to show REAL game_id
    this.authService.profile$.subscribe(profile => {
      if (profile && profile.game_id) {
        this.agentStatsSubject.next({
          ...this.agentStatsSubject.value,
          account: profile.game_id
        });
      }
    });
  }

  getAgentStats() { return this.agentStatsSubject.value; }
  getInviteStats() { return this.inviteStats; }
  getBanners() { return this.banners; }
  getCommissions() { return this.commissions; }

  claimCommission(commission: CommissionCard) {
    const amount = parseFloat(commission.reward);
    if (amount <= 0) return { success: false, message: 'No reward to claim' };

    // Update the local state for simulation
    commission.claimedBalance = (parseFloat(commission.claimedBalance) + amount).toFixed(2);
    commission.reward = '0.00';

    return { success: true, amount };
  }

  getMyDataStats(): MyDataStats {
    return {
      subordinateStats: [
        { label: 'New subordinates', value: '0' },
        { label: 'Number of deposits', value: '0' },
        { label: 'Number of first deposit players', value: '0' },
        { label: 'Register & 1st-deposit users', value: '0' },
        { label: 'Deposit amount', value: '0.00' },
        { label: 'First deposit amount', value: '0.00' },
        { label: 'Register & first deposit', value: '0.00' },
        { label: 'Withdrawal Amount', value: '0.00' },
        { label: 'Withdrawal times', value: '0' },
        { label: 'Receive rewards', value: '0.00' },
        { label: 'Number of recipients', value: '0' },
        { label: 'Valid Bets', value: '0.00' },
        { label: 'Number of bettors', value: '0' },
        { label: 'Direct wins/losses', value: '0.00' },
        { label: 'Sub\'s Perf.', value: '0.00' }
      ],
      revenueStats: [
        { label: 'Direct commission', value: '0.00', isYellow: true },
        { label: 'Other commission', value: '0.00', isYellow: true },
        { label: 'Total commission', value: '0.00', isYellow: true },
        { label: 'Get commission', value: '0.00', isYellow: true }, // The screenshot actually labels the 4th item "Get commission"
        { label: 'Promotional event rewards', value: '0.00', isYellow: false },
        { label: 'Agent activity rewards', value: '0.00', isYellow: false }
      ],
      allDataStats: [
        [
          { label: 'Total subordinates', value: '0' },
          { label: 'Direct subordinates', value: '0' },
          { label: 'Other subordinates', value: '0' }
        ],
        [
          { label: 'Sub\'s Perf.', value: '0.00' },
          { label: 'Others\' Perf.', value: '0.00' },
          { label: 'Total Perf.', value: '0.00' }
        ],
        [
          { label: 'Total direct sub\'s deposit', value: '0.00' },
          { label: 'Total direct sub\'s withdrawls', value: '0.00' },
          { label: 'Total direct sub\'s claim', value: '0.00' }
        ],
        [
          { label: 'Total direct sub\'s valid bet', value: '0.00' },
          { label: 'Total direct sub\'s win/loss', value: '0.00' }
        ]
      ],
      totalIncomeStats: [
        [
          { label: 'Direct commission', value: '0.00', isYellow: true },
          { label: 'Other commission', value: '0.00', isYellow: true },
          { label: 'Total commission', value: '0.00', isYellow: true }
        ],
        [
          { label: 'Unclaimed', value: '0.00', isYellow: true },
          { label: 'Claimed', value: '0.00', isYellow: true },
          { label: 'Total commission', value: '0.00', isYellow: true }
        ],
        [
          { label: 'Cumulative rewards for promotional activities', value: '0.00', isYellow: false },
          { label: 'Cumulative rewards for agency activities', value: '0.00', isYellow: false }
        ]
      ]
    };
  }

  getReferralLink(account: string) {
    return `https://bp999.site/?id=${account}`;
  }

  async fetchMyDataStats(): Promise<MyDataStats> {
    const stats = this.getMyDataStats();

    const user = this.authService.userSubject.value;
    if (!user) return stats;

    try {
      const { count: directCount } = await this.authService.supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('invited_by', user.id);

      const dCount = directCount || 0;
      const commission = dCount * 500; // Rs 500 per referral

      stats.subordinateStats[0].value = dCount.toString(); // New subordinates

      stats.revenueStats[0].value = commission.toFixed(2); // Direct commission
      stats.revenueStats[2].value = commission.toFixed(2); // Total commission
      stats.revenueStats[3].value = commission.toFixed(2); // Get commission

      stats.allDataStats[0][0].value = dCount.toString(); // Total subordinates
      stats.allDataStats[0][1].value = dCount.toString(); // Direct subordinates

      stats.totalIncomeStats[0][0].value = commission.toFixed(2); // Direct commission
      stats.totalIncomeStats[0][2].value = commission.toFixed(2); // Total commission

      this.inviteStats.cumulativeInvitees = dCount;
      this.inviteStats.totalEarnings = commission.toFixed(2);
    } catch (e) {
      console.error('Error fetching referral stats:', e);
    }

    return stats;
  }
}

