import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  getBalance(): Observable<number> { return this.balanceSubject.asObservable(); }
  getAvailableDraws(): Observable<number> { return this.drawsSubject.asObservable(); }
  getTasks(): Observable<LuckyTask[]> { return this.tasksSubject.asObservable(); }
  getRecords(): Observable<LuckyRecord[]> { return this.recordsSubject.asObservable(); }

  spin() {
    const draws = this.drawsSubject.value;
    if (draws > 0) {
      this.drawsSubject.next(draws - 1);
      
      // Add a simulated record
      setTimeout(() => {
        const amt = (Math.random() * 50).toFixed(2);
        const newRecord: LuckyRecord = {
          dateStr: new Date().toLocaleDateString('en-GB'),
          timeStr: new Date().toLocaleTimeString('en-GB'),
          description: 'Free draw, get ',
          highlight: amt
        };
        const currentRecs = this.recordsSubject.value;
        this.recordsSubject.next([newRecord, ...currentRecs]);
        this.balanceSubject.next(this.balanceSubject.value + parseFloat(amt));
      }, 3000); // Wait for spin animation duration
      return true; // Spun successfully
    }
    return false; // No draws
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
