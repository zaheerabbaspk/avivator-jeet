import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

export interface WithdrawalAccount {
  id?: string;
  user_id: string;
  method_key: string;
  method_name: string;
  real_name: string;
  account_id: string;
  id_number: string;
  created_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {
  private authService = inject(AuthService);
  private supabase = this.authService.supabase;

  private accountsSub = new BehaviorSubject<WithdrawalAccount[]>([]);
  accounts$ = this.accountsSub.asObservable();

  constructor() {}

  async fetchAccounts() {
    const user = this.authService.userSubject.value;
    if (!user) return;

    const { data, error } = await this.supabase
      .from('withdrawal_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      this.accountsSub.next(data);
    }
    return { data, error };
  }

  async addAccount(account: Partial<WithdrawalAccount>) {
    const user = this.authService.userSubject.value;
    if (!user) throw new Error('User not logged in');

    const newAccount = {
      ...account,
      user_id: user.id,
      created_at: new Date()
    };

    const { data, error } = await this.supabase
      .from('withdrawal_accounts')
      .insert(newAccount)
      .select()
      .single();

    if (!error && data) {
      const current = this.accountsSub.value;
      this.accountsSub.next([data, ...current]);
    }
    return { data, error };
  }

  async saveWithdrawalPassword(password: string) {
    const user = this.authService.userSubject.value;
    if (!user) throw new Error('User not logged in');

    // 0. Check if user already has a PIN
    const { data: currentProfile } = await this.supabase
      .from('profiles')
      .select('withdrawal_password')
      .eq('id', user.id)
      .single();

    if (currentProfile?.withdrawal_password) {
      return { data: null, error: { message: 'PIN has already been set and cannot be changed.' } };
    }

    // 1. Check if PIN already taken by another user
    const { data: existing } = await this.supabase
      .from('profiles')
      .select('id')
      .eq('withdrawal_password', password)
      .maybeSingle();

    if (existing && existing.id !== user.id) {
      return { data: null, error: { code: '23505', message: 'PIN already exists' } };
    }

    // 2. Perform the update
    const { data, error } = await this.supabase
      .from('profiles')
      .update({ withdrawal_password: password })
      .eq('id', user.id);

    return { data, error };
  }

  async checkWithdrawalPassword() {
    const user = this.authService.userSubject.value;
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await this.supabase
      .from('profiles')
      .select('withdrawal_password')
      .eq('id', user.id)
      .single();

    return { data: data?.withdrawal_password, error };
  }

  async submitWithdrawalRequest(amount: number, accountId: string) {
    const user = this.authService.userSubject.value;
    if (!user) throw new Error('User not logged in');

    const newRequest = {
      user_id: user.id,
      account_id: accountId,
      amount: amount,
      status: 'pending',
      submitted_at: new Date()
    };

    const { data, error } = await this.supabase
      .from('withdrawal_requests')
      .insert(newRequest)
      .select()
      .single();

    return { data, error };
  }

  async fetchWithdrawalHistory() {
    const user = this.authService.userSubject.value;
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await this.supabase
      .from('withdrawal_requests')
      .select('*, withdrawal_accounts(method_name, account_id)')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });

    return { data, error };
  }
}
