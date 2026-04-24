import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { InviteService } from './invite.service';

export interface LuckyTask {
  id: string;
  icon: string;
  title: string;
  rewardValue: number;
  progressText: string;
  isComplete: boolean;
  subtext?: string;
  actionText?: string;
  actionClass?: string;
}

export interface LuckyRecord {
  dateStr: string;
  timeStr: string;
  description: string;
  highlight?: string;
}

export interface WheelItem {
  id: string;
  label: string;
  color: string;
  icon: string;
  rotation: number;
}

@Injectable({
  providedIn: 'root'
})
export class LuckyDrawService {
  private balanceSubject = new BehaviorSubject<number>(480.10);
  private drawsSubject = new BehaviorSubject<number>(1);
  
  private tasksSubject = new BehaviorSubject<LuckyTask[]>([
    {
      id: 'task1',
      icon: 'time-outline',
      title: 'Daily online 2 hours',
      rewardValue: 1,
      progressText: '01:54:19',
      subtext: 'can get',
      isComplete: false
    },
    {
      id: 'task2',
      icon: 'calendar-outline',
      title: 'Daily Login',
      rewardValue: 1,
      progressText: '11:49:38',
      subtext: 'Free draw:',
      isComplete: true
    },
    {
      id: 'task3',
      icon: 'people-outline',
      title: 'Each effective referral 1 p...',
      rewardValue: 1,
      progressText: '',
      subtext: 'Subordinate recharge ≥ 200.00 ... Details',
      isComplete: false,
      actionText: 'Go to invite',
      actionClass: 'bg-[#F1C15A] text-[#1A1C22]'
    }
  ]);

  private recordsSubject = new BehaviorSubject<LuckyRecord[]>([
    {
      dateStr: '17/04/2026',
      timeStr: '22:38:13',
      description: 'Free draw, get ',
      highlight: '5.94'
    },
    {
      dateStr: '12/04/2026',
      timeStr: '12:09:38',
      description: 'Free draw, get ',
      highlight: '8.15'
    },
    {
      dateStr: '12/04/2026',
      timeStr: '12:08:37',
      description: 'Daily login, +1 draw'
    },
    {
      dateStr: '12/04/2026',
      timeStr: '12:08:36',
      description: 'Lucky draw, get ',
      highlight: '480.10'
    }
  ]);

  constructor(private authService: AuthService) {
    this.authService.profile$.subscribe(profile => {
      if (profile) {
        this.drawsSubject.next(profile.lucky_spins || 0);
      } else {
        this.drawsSubject.next(0);
      }
    });
  }

  getBalance(): Observable<number> { return this.balanceSubject.asObservable(); }
  getAvailableDraws(): Observable<number> { return this.drawsSubject.asObservable(); }
  getTasks(): Observable<LuckyTask[]> { return this.tasksSubject.asObservable(); }
  getRecords(): Observable<LuckyRecord[]> { return this.recordsSubject.asObservable(); }

  async spin() {
    const draws = this.drawsSubject.value;
    if (draws > 0) {
      // Optimistic update
      this.drawsSubject.next(draws - 1);
      
      // Deduct spin in database
      try {
          await this.authService.updateProfile({ lucky_spins: draws - 1 });
      } catch (err) {
          console.error('Failed to deduct spin', err);
          // Revert on failure
          this.drawsSubject.next(draws);
          return { success: false, index: -1 };
      }
      
      const items = this.getWheelItems();
      const randomIndex = Math.floor(Math.random() * items.length);
      const selectedItem = items[randomIndex];

      // Simulated delay for animation
      setTimeout(() => {
        let amt = 0;
        // Logic to interpret labels like '10-100' or 'X2'
        if (selectedItem.label.includes('-')) {
          const parts = selectedItem.label.split('-');
          const min = parseFloat(parts[0]);
          const max = parseFloat(parts[1]);
          amt = Math.random() * (max - min) + min;
        } else if (selectedItem.label === 'X2') {
          amt = this.balanceSubject.value; // Doubling the current lucky balance
        }

        const amtStr = amt.toFixed(2);
        const newRecord: LuckyRecord = {
          dateStr: new Date().toLocaleDateString('en-GB'),
          timeStr: new Date().toLocaleTimeString('en-GB'),
          description: `Lucky draw (${selectedItem.label}), get `,
          highlight: amtStr
        };

        const currentRecs = this.recordsSubject.value;
        this.recordsSubject.next([newRecord, ...currentRecs]);
        this.balanceSubject.next(this.balanceSubject.value + parseFloat(amtStr));
      }, 4500); 

      return { success: true, index: randomIndex };
    }
    return { success: false, index: -1 };
  }

  async getValidInviteCount(): Promise<number> {
    const user = this.authService.userSubject.value;
    if (!user) return 0;
    
    // Get user's game_id
    const { data: profile } = await this.authService.supabase
      .from('profiles')
      .select('game_id')
      .eq('id', user.id)
      .single();
      
    if (!profile?.game_id) return 0;

    const { count } = await this.authService.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('invited_by', profile.game_id);

    return count || 0;
  }

  async claimBalance() {
    const amount = this.balanceSubject.value;
    if (amount <= 0) return { success: false, message: 'No balance to claim' };

    const invites = await this.getValidInviteCount();
    if (invites < 1) {
      return { success: false, message: 'You must invite at least 1 friend to claim this balance!' };
    }

    // Update real balance
    this.authService.updateBalance(amount);
    this.balanceSubject.next(0);
    
    return { success: true, amount };
  }

  getWheelItems(): WheelItem[] {
    const totalSlices = 8;
    const sliceAngle = 360 / totalSlices;
    const items = [
      { id: '1', label: '0-500', icon: './assets/images/sprites/wheel_gift_purple.png', color: '#B3E4AF' },
      { id: '2', label: '1-55', icon: './assets/images/sprites/wheel_coin_stack.png', color: '#F1F7C6' },
      { id: '3', label: '10-100', icon: './assets/images/sprites/wheel_gift_pink.png', color: '#B3E4AF' },
      { id: '4', label: '50-200', icon: './assets/images/sprites/wheel_gift_purple.png', color: '#F1F7C6' },
      { id: '5', label: '100-300', icon: './assets/images/sprites/wheel_coin_stack.png', color: '#B3E4AF' },
      { id: '6', label: '155-400', icon: './assets/images/sprites/wheel_gift_blue.png', color: '#F1F7C6' },
      { id: '7', label: '200-500', icon: './assets/images/sprites/wheel_gift_pink.png', color: '#B3E4AF' },
      { id: '8', label: 'X2', icon: './assets/images/sprites/wheel_gift_blue.png', color: '#F1F7C6' }
    ];
    return items.map((item, index) => ({
      ...item,
      rotation: index * sliceAngle
    }));
  }
}
