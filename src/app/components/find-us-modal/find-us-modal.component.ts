import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, copyOutline, checkmarkCircle, searchOutline, globeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-find-us-modal',
  templateUrl: './find-us-modal.component.html',
  styleUrls: ['./find-us-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FindUsModalComponent {
  @Input() isOpen = false;
  @Output() didDismiss = new EventEmitter<void>();

  constructor() {
    addIcons({ closeOutline, copyOutline, checkmarkCircle, searchOutline, globeOutline });
  }

  dismiss() {
    this.didDismiss.emit();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast here if needed
      console.log('Copied to clipboard:', text);
    });
  }

  copyAll() {
    const allUrls = [
      'No777.me', 'No777.org', 'No777.win',
      'www.12no777.com', 'www.13no777.com', 'www.14no777.com'
    ].join('\n');
    this.copyToClipboard(allUrls);
  }
}
