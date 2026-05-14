import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  copyOutline, chevronDownOutline, shareSocialOutline,
  downloadOutline, paperPlane, logoFacebook, logoInstagram,
  logoWhatsapp, closeCircleOutline, closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-invite-bonus-modal',
  templateUrl: './invite-bonus-modal.component.html',
  styleUrls: ['./invite-bonus-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class InviteBonusModalComponent {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();

  posters = [
    'https://140.150.30.128:5030/common/upload/1976890870842892290.avif',
    'https://140.150.30.128:5030/common/upload/1976890922248642561.avif',
    'https://140.150.30.128:5030/common/upload/1976890870842892290.avif',
    'https://140.150.30.128:5030/common/upload/1976890922248642561.avif',
    'https://140.150.30.128:5030/common/upload/1976890870842892290.avif',
    'https://140.150.30.128:5030/common/upload/1976890922248642561.avif',
    'https://140.150.30.128:5030/common/upload/1976890870842892290.avif',
    'https://140.150.30.128:5030/common/upload/1976890922248642561.avif',
    'https://140.150.30.128:5030/common/upload/1976890870842892290.avif',
  ];

  constructor() {
    addIcons({
      copyOutline, chevronDownOutline, shareSocialOutline,
      downloadOutline, paperPlane, logoFacebook, logoInstagram,
      logoWhatsapp, closeCircleOutline, closeOutline
    });
  }

  share(platform: string) {
    const text = encodeURIComponent('Join me on bp999 and get amazing rewards!');
    const url = encodeURIComponent('https://bp999.site/?id=126406886');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `whatsapp://send?text=${text} ${url}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL for feed/stories via browser, usually opens app
        shareUrl = `instagram://`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: 'bp999', text: 'Join me!', url: 'https://bp999.site/?id=126406886' });
          return;
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  }

  close() {
    this.modalClose.emit();
  }
}

