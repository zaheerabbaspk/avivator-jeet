import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  headsetOutline, 
  chatbubbleEllipsesOutline, 
  logoWhatsapp, 
  paperPlaneOutline, 
  helpCircleOutline,
  documentTextOutline,
  mailOutline,
  timeOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonContent, IonIcon, FooterNavComponent]
})
export class SupportPage {
  private router = inject(Router);

  supportChannels = [
    {
      id: 'livechat',
      name: 'Live Chat',
      desc: 'Instant support from our team',
      icon: 'chatbubble-ellipses-outline',
      color: '#00CFFF',
      action: () => this.openLink('https://direct.lc.chat/your-id/')
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      desc: 'Chat with us on WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      action: () => this.openLink('https://wa.me/your-number')
    },
    {
      id: 'telegram',
      name: 'Telegram',
      desc: 'Join our Telegram support group',
      icon: 'paper-plane-outline',
      color: '#0088CC',
      action: () => this.openLink('https://t.me/your-group')
    }
  ];

  faqs = [
    {
      q: 'How to deposit money?',
      a: 'Go to the Deposit page, select your method (JazzCash/EasyPaisa), and follow the instructions.'
    },
    {
      q: 'When will I get my withdrawal?',
      a: 'Withdrawals are usually processed within 1-2 hours, but can take up to 24 hours during peak times.'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes, we use industry-standard encryption to protect your personal and financial information.'
    }
  ];

  constructor() {
    addIcons({ 
      chevronBackOutline, 
      headsetOutline, 
      chatbubbleEllipsesOutline, 
      logoWhatsapp, 
      paperPlaneOutline, 
      helpCircleOutline,
      documentTextOutline,
      mailOutline,
      timeOutline
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  handleRecords() {
    console.log('Support records clicked');
  }
}
