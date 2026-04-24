import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { volumeMedium } from 'ionicons/icons';

@Component({
  selector: 'app-home-announce',
  templateUrl: './home-announce.component.html',
  styleUrls: ['./home-announce.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class HomeAnnounceComponent {
  speakerIcon = 'https://140.150.30.128:5030/siteadmin/skin/lobby_asset/2-1-7/web/home/icon_dt_pmd.avif'; // Gift/Promo icon
  envelopeIcon = 'https://140.150.30.128:5030/siteadmin/skin/lobby_asset/2-1-7/common/_sprite/icon_dt_1xx_wd.avif'; // Envelope icon

  constructor() {
    addIcons({ volumeMedium });
  }
}
