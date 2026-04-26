import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-offer-sidebar',
  templateUrl: './offer-sidebar.component.html',
  styleUrls: ['./offer-sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class OfferSidebarComponent {
  @Input() activeSidebar: string = 'all';
  @Input() isLoadingRewards: boolean = false;
  
  @Output() sidebarChange = new EventEmitter<string>();
  @Output() navigateToHistory = new EventEmitter<void>();
  @Output() refreshRewards = new EventEmitter<void>();
  @Output() openRedemption = new EventEmitter<void>();

  isLogoVisible: boolean = true;

  setSidebar(id: string) {
    this.sidebarChange.emit(id);
  }

  removeLogo() {
    this.isLogoVisible = false;
  }
}
