import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SideMenuService } from './services/side-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, SideMenuComponent],
})
export class AppComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public sideMenuService = inject(SideMenuService);

  constructor() {
    // Force splash screen on every refresh/cold start
    this.router.navigate(['/splash'], { replaceUrl: true });

    this.route.queryParams.subscribe(params => {
      const inviteId = params['id'];
      if (inviteId) {
        localStorage.setItem('inviteCode', inviteId);
      }
    });
  }
}

