import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-offer-header',
  templateUrl: './offer-header.component.html',
  styleUrls: ['./offer-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonIcon]
})
export class OfferHeaderComponent {
  @Input() tabs: any[] = [];
  @Input() activeTab: string = '';
  @Output() tabChange = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  selectTab(id: string) {
    this.tabChange.emit(id);
  }
}
