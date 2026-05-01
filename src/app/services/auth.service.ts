import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { User } from '@supabase/supabase-js';

// LocalStorage keys
const LS_PROFILE_KEY = 'aj_cached_profile';
const LS_BALANCE_KEY = 'aj_cached_balance';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  public supabase = this.supabaseService.client;

  public userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  private balanceSub = new BehaviorSubject<number>(0);
  balance$ = this.balanceSub.asObservable();

  private profileSub = new BehaviorSubject<any>(null);
  profile$ = this.profileSub.asObservable();

  constructor() {
    // ── Step 1: Load cached profile immediately so UI shows data before API responds ──
    this.loadFromCache();

    // ── Step 2: Check active session and refresh from API ──
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      this.userSubject.next(user);
      if (user) {
        this.refreshProfile(user.id);
      } else {
        // No session — clear any stale cache
        this.clearCache();
      }
    });

    // ── Step 3: Listen for auth state changes (login / logout / token refresh) ──
    this.supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      this.userSubject.next(user);
      if (user) {
        // Delay slightly so that profile upsert (done after signUp) has time to complete
        setTimeout(() => this.refreshProfile(user.id), 800);
      } else {
        this.balanceSub.next(0);
        this.profileSub.next(null);
        this.clearCache();
      }
    });
  }

  // ── Cache Helpers ──────────────────────────────────────────────────────────────

  private loadFromCache() {
    try {
      const cachedProfile = localStorage.getItem(LS_PROFILE_KEY);
      const cachedBalance = localStorage.getItem(LS_BALANCE_KEY);
      if (cachedProfile) {
        const profile = JSON.parse(cachedProfile);
        this.profileSub.next(profile);
      }
      if (cachedBalance) {
        this.balanceSub.next(parseFloat(cachedBalance));
      }
    } catch (e) {
      console.warn('Failed to load profile from cache:', e);
    }
  }

  private saveToCache(profile: any) {
    try {
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(LS_BALANCE_KEY, String(profile.balance || 0));
    } catch (e) {
      console.warn('Failed to save profile to cache:', e);
    }
  }

  private clearCache() {
    try {
      localStorage.removeItem(LS_PROFILE_KEY);
      localStorage.removeItem(LS_BALANCE_KEY);
    } catch (e) {}
  }

  // ── Profile Refresh (Stale-While-Revalidate) ──────────────────────────────────

  async refreshProfile(userId: string, retries = 3): Promise<void> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const { data, error } = await this.supabase
          .from('profiles')
          .select()
          .eq('id', userId);

        if (error) throw error;

        if (data && data.length > 0) {
          let profileData = data[0];

          // SELF-HEALING: If user has no game_id, generate one and update DB
          if (!profileData.game_id) {
            const newGameId = Math.floor(100000000 + Math.random() * 900000000).toString();
            const { error: patchErr } = await this.supabase
              .from('profiles')
              .update({ game_id: newGameId })
              .eq('id', userId);
            
            if (!patchErr) {
              profileData = { ...profileData, game_id: newGameId };
            }
          }

          // Emit fresh data to all subscribers
          this.profileSub.next(profileData);
          this.balanceSub.next(profileData.balance || 0);
          // Persist to localStorage so next launch is instant
          this.saveToCache(profileData);
        }
        return; // Success
      } catch (error) {
        console.error('Error fetching profile:', error);
        return;
      }
    }
  }

  // ── Balance Operations ─────────────────────────────────────────────────────────

  async claimBonus(amount: number) {
    const user = this.userSubject.value;
    if (!user) throw new Error('Login required to claim bonus');

    // 1. Get latest balance to be safe
    const { data: current, error: fetchErr } = await this.supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();
    
    if (fetchErr) throw fetchErr;

    const newBalance = (current?.balance || 0) + amount;

    // 2. Update DB
    const { error: updateErr } = await this.supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);
    
    if (updateErr) throw updateErr;

    // 3. Emit new value and update cache
    this.balanceSub.next(newBalance);
    const cached = this.profileSub.value;
    if (cached) {
      const updated = { ...cached, balance: newBalance };
      this.profileSub.next(updated);
      this.saveToCache(updated);
    }
    return newBalance;
  }

  async updateBalance(amount: number) {
    return this.claimBonus(amount);
  }

  // ── Auth Guards ────────────────────────────────────────────────────────────────

  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => {
      if (user === undefined) return undefined;
      return !!user;
    }),
    // @ts-ignore
    filter(val => val !== undefined)
  );

  // ── Auth Methods ───────────────────────────────────────────────────────────────

  async signUp(email: string, pass: string, metadata?: any) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password: pass,
        options: { data: metadata }
      });
      if (error) {
        console.error('Supabase SignUp Error:', error);
        throw error;
      }
      return data.user;
    } catch (error) {
      console.error('Catch SignUp Error:', error);
      throw error;
    }
  }

  async signIn(email: string, pass: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (error) throw error;
      return data.user;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    this.clearCache();
    return this.supabase.auth.signOut();
  }

  async updateProfile(profile: any) {
    const user = this.userSubject.value;
    if (!user) throw new Error('No user logged in');

    const { data, error } = await this.supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date()
      });

    if (error) throw error;

    // Update cache with the new profile data
    const cached = this.profileSub.value;
    if (cached) {
      const updated = { ...cached, ...profile, updated_at: new Date() };
      this.profileSub.next(updated);
      this.saveToCache(updated);
    }

    return data;
  }
}


