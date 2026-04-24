import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export type BonusStatus =
  | 'loading'          // Checking eligibility
  | 'no_deposit'       // Never deposited
  | 'eligible'         // Has deposited >= 100, bonus available today
  | 'already_claimed'; // Already claimed today

export interface DailyBonus {
  status: BonusStatus;
  amount: number;          // Bonus amount (10 PKR if eligible)
  totalDeposited: number;  // User's total lifetime deposit
}

@Injectable({ providedIn: 'root' })
export class BonusService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private supabase = this.supabaseService.client;

  // ── Public State ──────────────────────────────────────────────────────────
  bonusStatus = signal<BonusStatus>('loading');
  bonusAmount = signal<number>(10); // 10 PKR per 100 PKR deposit
  isClaiming = signal<boolean>(false);

  // ── Check if user is eligible for daily bonus ─────────────────────────────
  async checkEligibility(): Promise<DailyBonus> {
    this.bonusStatus.set('loading');

    const user = this.authService.userSubject.value;
    if (!user) {
      return { status: 'no_deposit', amount: 0, totalDeposited: 0 };
    }

    try {
      // 1. Get user's total deposits from Supabase
      const { data: deposits, error: depErr } = await this.supabase
        .from('deposits')
        .select('amount, status')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      if (depErr) throw depErr;

      const totalDeposited = (deposits || []).reduce(
        (sum: number, d: any) => sum + (d.amount || 0), 0
      );

      // 2. No deposit at all — redirect to deposit page
      if (totalDeposited < 100) {
        this.bonusStatus.set('no_deposit');
        return { status: 'no_deposit', amount: 0, totalDeposited };
      }

      // 3. Calculate bonus: 10 PKR per 100 PKR deposited (capped at daily max)
      const bonusAmount = Math.floor(totalDeposited / 100) * 10;
      this.bonusAmount.set(bonusAmount);

      // 4. Check if already claimed today
      const today = new Date().toISOString().split('T')[0];
      const { data: todaysClaim, error: claimErr } = await this.supabase
        .from('daily_bonuses')
        .select('id, claimed_at')
        .eq('user_id', user.id)
        .gte('claimed_at', `${today}T00:00:00`)
        .lte('claimed_at', `${today}T23:59:59`)
        .maybeSingle();

      if (claimErr) throw claimErr;

      if (todaysClaim) {
        this.bonusStatus.set('already_claimed');
        return { status: 'already_claimed', amount: bonusAmount, totalDeposited };
      }

      // 5. Eligible!
      this.bonusStatus.set('eligible');
      return { status: 'eligible', amount: bonusAmount, totalDeposited };

    } catch (err) {
      console.error('BonusService: Error checking eligibility', err);
      this.bonusStatus.set('no_deposit');
      return { status: 'no_deposit', amount: 0, totalDeposited: 0 };
    }
  }

  // ── Claim the daily bonus ─────────────────────────────────────────────────
  async claimDailyBonus(): Promise<number> {
    const user = this.authService.userSubject.value;
    if (!user) throw new Error('Not logged in');
    if (this.isClaiming()) throw new Error('Already claiming');

    this.isClaiming.set(true);

    try {
      const amount = this.bonusAmount();

      // 1. Record the claim in daily_bonuses table
      const { error: insertErr } = await this.supabase
        .from('daily_bonuses')
        .insert({
          user_id: user.id,
          amount: amount,
          claimed_at: new Date().toISOString()
        });

      if (insertErr) throw insertErr;

      // 2. Add the bonus to user's balance via AuthService
      const newBalance = await this.authService.claimBonus(amount);

      this.bonusStatus.set('already_claimed');
      return amount;

    } finally {
      this.isClaiming.set(false);
    }
  }
}
