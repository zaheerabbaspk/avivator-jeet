import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SideMenuService } from './services/side-menu.service';
import { App } from '@capacitor/app';
import { SoundService } from './services/sound.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, SideMenuComponent],
})
export class AppComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public sideMenuService = inject(SideMenuService);
  private soundService = inject(SoundService);

  constructor() {
    // Force splash screen on every refresh/cold start
    this.router.navigate(['/splash'], { replaceUrl: true });

    this.route.queryParams.subscribe(params => {
      const inviteId = params['id'];
      if (inviteId) {
        localStorage.setItem('inviteCode', inviteId);
      }
    });

    this.initializeAppListeners();

    // Unlock audio on first user interaction for iOS/iPhone
    const unlock = () => {
      this.soundService.unlockAudio();
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
  }

  ngOnInit() {}

  private initializeAppListeners() {
    // 1. Handle Capacitor App State (Android/iOS)
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        console.log('App became active - Resuming sounds');
        this.soundService.resumeAll();
      } else {
        console.log('App went to background - Pausing sounds');
        this.soundService.pauseAll();
      }
    });

    // 2. Handle Web Visibility API (PWA/Web fallback)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.soundService.pauseAll();
      } else {
        this.soundService.resumeAll();
      }
    });
  }
}

