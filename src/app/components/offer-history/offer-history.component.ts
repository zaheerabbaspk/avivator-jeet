import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { HistoryRecord } from '../../services/offers.service';

@Component({
  selector: 'app-offer-history',
  templateUrl: './offer-history.component.html',
  styleUrls: ['./offer-history.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class OfferHistoryComponent {
  @Input() activeHistoryFilter: string = 'Today';
  @Input() activeStatusFilter: string = 'All';
  @Input() isHistoryFilterOpen: boolean = false;
  @Input() isStatusFilterOpen: boolean = false;
  @Input() historyPeriods: string[] = [];
  @Input() statusOptions: string[] = [];
  @Input() historyRecords: HistoryRecord[] = [];
  @Input() pendingHistoryFilter: string = 'Today';

  @Output() toggleHistory = new EventEmitter<void>();
  @Output() confirmHistory = new EventEmitter<string>();
  @Output() toggleStatus = new EventEmitter<void>();
  @Output() setStatus = new EventEmitter<string>();
  @Output() setPendingFilter = new EventEmitter<string>();

  onSelectPending(period: string) {
    this.setPendingFilter.emit(period);
  }
}
