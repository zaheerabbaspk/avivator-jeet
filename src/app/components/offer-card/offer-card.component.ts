import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shareOutline, arrowRedo } from 'ionicons/icons';
import { OfferCardData } from '../../services/offers.service';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class OfferCardComponent {
  @Input() offer!: OfferCardData;
  @Output() cardClick = new EventEmitter<OfferCardData>();
  @Output() shareClick = new EventEmitter<OfferCardData>();

  constructor() {
    addIcons({ shareOutline, arrowRedo });
  }

  onCardClick() {
    this.cardClick.emit(this.offer);
  }

  onShareClick(event: Event) {
    event.stopPropagation();
    this.shareClick.emit(this.offer);
  }
}
