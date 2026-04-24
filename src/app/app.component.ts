import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
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
  public sideMenuService = inject(SideMenuService);

  constructor() {
    this.route.queryParams.subscribe(params => {
      const inviteId = params['id'];
      if (inviteId) {
        localStorage.setItem('inviteCode', inviteId);
      }
    });
  }
}

