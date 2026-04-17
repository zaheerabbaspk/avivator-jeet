import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-promotion-sharing',
  templateUrl: './promotion-sharing.component.html',
  styleUrls: ['./promotion-sharing.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class PromotionSharingComponent {
  @Input() referralCode = '126406886';
  @Input() referralLink = 'https://5no777.com/?id=126406886';
  
  @Output() copy = new EventEmitter<string>();
  @Output() share = new EventEmitter<string>();

  activeTutorialTab = 'A'; // 'A', 'B1', 'B2'

  selectTab(tab: string) {
    this.activeTutorialTab = tab;
  }
}
