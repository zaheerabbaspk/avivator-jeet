import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferCardComponent } from '../offer-card/offer-card.component';
import { OfferCardData } from '../../services/offers.service';

@Component({
  selector: 'app-offer-event',
  templateUrl: './offer-event.component.html',
  styleUrls: ['./offer-event.component.scss'],
  standalone: true,
  imports: [CommonModule, OfferCardComponent]
})
export class OfferEventComponent {
  @Input() offers: OfferCardData[] = [];
  @Output() offerClick = new EventEmitter<OfferCardData>();
  @Output() shareClick = new EventEmitter<OfferCardData>();
}
