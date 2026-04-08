import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-treasure-modal',
  templateUrl: './treasure-modal.component.html',
  styleUrls: ['./treasure-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonModal, IonIcon]
})
export class TreasureModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() didDismiss = new EventEmitter<void>();

  isOpened: boolean = false;
  coins: any[] = [];
  burstCoins: any[] = [];

  constructor() {
    addIcons({ closeOutline });
    this.generateCoins();
    this.generateBurstCoins();
  }

  generateCoins() {
    this.coins = Array.from({ length: 50 }, (_, i) => ({
      left: Math.random() * 100 + '%',
      delay: Math.random() * 5 + 's',
      size: (Math.random() * 15 + 15) + 'px'
    }));
  }

  generateBurstCoins() {
    this.burstCoins = Array.from({ length: 15 }, (_, i) => ({
      left: (45 + Math.random() * 10) + '%',
      delay: (Math.random() * 0.4) + 's',
      angle: (Math.random() * 120 - 60) + 'deg'
    }));
  }

  ngOnInit() {}

  openChest() {
    if (this.isOpened) return;
    this.isOpened = true;
    
    // Potential for more logic here, like showing a reward message
    console.log('Treasure Chest Opened!');
  }

  dismiss() {
    this.isOpen = false;
    this.isOpened = false;
    this.didDismiss.emit();
  }
}
