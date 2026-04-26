import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ checkmarkCircle });
  }

  async showSuccess(message: string = 'Copied successfully') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'success-toast',
      buttons: [
        {
          side: 'start',
          icon: 'checkmark-circle'
        }
      ]
    });
    await toast.present();
  }

  async copyToClipboard(text: string, successMessage: string = 'Copied successfully') {
    try {
      await navigator.clipboard.writeText(text);
      this.showSuccess(successMessage);
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  }
}
