import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { UnclaimedSummary } from '../../services/offers.service';

@Component({
  selector: 'app-offer-unclaimed',
  templateUrl: './offer-unclaimed.component.html',
  styleUrls: ['./offer-unclaimed.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class OfferUnclaimedComponent {
  @Input() unclaimed: UnclaimedSummary | null = null;
  @Input() isLoadingUnclaimed: boolean = false;

  @Output() refreshUnclaimed = new EventEmitter<void>();
  @Output() claimCategory = new EventEmitter<any>();
}
