import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, chevronForward, mail } from 'ionicons/icons';

@Component({
  selector: 'app-announcement-modal',
  templateUrl: './announcement-modal.component.html',
  styleUrls: ['./announcement-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonModal, IonIcon]
})
export class AnnouncementModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  activeTab = 'vip';

  constructor() {
    addIcons({ close, chevronForward, mail });
  }

  dismiss() {
    this.close.emit();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
