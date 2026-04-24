import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, MenuController, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack, globeOutline, searchOutline, flame, server, cube, albums,
  football, videocam, fish, time, star, documentText, shareSocial, people,
  medal, calendar, ribbon, gift, download, headset, helpCircle, caretDown,
  wallet, share, clipboard, personCircle
} from 'ionicons/icons';
import { SideMenuService } from '../../services/side-menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonBadge]
})
export class SideMenuComponent {
  private menuCtrl = inject(MenuController);
  public sideMenuService = inject(SideMenuService);
  private router = inject(Router);

  constructor() {
    addIcons({
      arrowBack, globeOutline, searchOutline, flame, server, cube, albums,
      football, videocam, fish, time, star, documentText, shareSocial, people,
      medal, calendar, ribbon, gift, download, headset, helpCircle, caretDown,
      wallet, share, clipboard, personCircle
    });
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  navigateTo(route: string) {
    // this.closeMenu(); // Keep menu open on click as requested
    // this.router.navigate([route]);
    console.log('Navigating to:', route);
  }
}
