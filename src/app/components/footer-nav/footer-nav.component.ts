import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IonFooter, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, giftOutline, peopleOutline, headsetOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
  standalone: true,
  imports: [IonFooter, IonIcon, CommonModule],
})
export class FooterNavComponent {
  @Input() activeTab: string = 'home';

  private router = inject(Router);

  constructor() {
    addIcons({ homeOutline, giftOutline, peopleOutline, headsetOutline, personOutline });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onOffersClick() {
    this.router.navigate(['/offers']);
  }
}
