import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },

  {
    path: 'crash-game',
    loadComponent: () => import('./pages/crash-game/crash-game.page').then((m) => m.CrashGamePage),
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'deposit',
    loadComponent: () => import('./pages/deposit/deposit.page').then((m) => m.DepositPage),
    canActivate: [authGuard]
  },
  {
    path: 'withdraw',
    loadComponent: () => import('./pages/withdraw/withdraw.page').then((m) => m.WithdrawPage),
    canActivate: [authGuard]
  },
  {
    path: 'offers',
    loadComponent: () => import('./pages/offers/offers.page').then((m) => m.OffersPage),
  },
  {
    path: 'invite',
    loadComponent: () => import('./pages/invite/invite.page').then((m) => m.InvitePage),
  },
  {
    path: 'support',
    loadComponent: () => import('./pages/support/support.page').then((m) => m.SupportPage),
  },
  {
    path: 'records',
    loadComponent: () => import('./pages/records/records.page').then((m) => m.RecordsPage),
  },

  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
];
