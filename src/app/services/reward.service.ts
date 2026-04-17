import { Injectable, signal } from '@angular/core';

export interface RegistrationReward {
  id: string;
  title: string;
  maxBonus: number;
  condition: string;
  timer: string; // HH:mm:ss
  type: 'deposit' | 'referral';
}

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  
  // Static data for the design demonstration
  private registrationRewards = signal<RegistrationReward[]>([
    {
      id: 'r1',
      title: 'First Deposit≥200',
      maxBonus: 777777,
      condition: 'First Deposit >= 200',
      timer: '11:51:16',
      type: 'deposit'
    },
    {
      id: 'r2',
      title: 'Total Deposits≥1000',
      maxBonus: 777777,
      condition: 'Total Deposits >= 1000',
      timer: '11:51:16',
      type: 'deposit'
    },
    {
      id: 'r3',
      title: 'Single Deposit≥500',
      maxBonus: 777777,
      condition: 'Single Deposit >= 500',
      timer: '11:51:16',
      type: 'deposit'
    }
  ]);

  getRegistrationRewards() {
    return this.registrationRewards();
  }
}
