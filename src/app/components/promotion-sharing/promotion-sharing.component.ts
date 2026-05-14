import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logoInstagram, 
  logoWhatsapp, 
  logoTiktok, 
  logoX, 
  logoTwitter, 
  paperPlane,
  person,
  copyOutline,
  chevronDownOutline,
  help
} from 'ionicons/icons';

@Component({
  selector: 'app-promotion-sharing',
  templateUrl: './promotion-sharing.component.html',
  styleUrls: ['./promotion-sharing.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class PromotionSharingComponent {
  @Input() referralCode = '---';
  @Input() referralLink = 'https://bp999.site/?id=---';
  
  @Output() copy = new EventEmitter<string>();
  @Output() share = new EventEmitter<string>();

  activeTutorialTab = 'A'; // 'A', 'B1', 'B2'

  constructor() {
    addIcons({ 
      logoInstagram, 
      logoWhatsapp, 
      logoTiktok, 
      logoX, 
      logoTwitter, 
      paperPlane,
      person,
      copyOutline,
      chevronDownOutline,
      help
    });
  }

  selectTab(tab: string) {
    this.activeTutorialTab = tab;
  }
}

