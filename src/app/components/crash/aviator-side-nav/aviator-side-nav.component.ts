import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, wallet, play } from 'ionicons/icons';

@Component({
  selector: 'app-aviator-side-nav',
  templateUrl: './aviator-side-nav.component.html',
  styleUrls: ['./aviator-side-nav.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class AviatorSideNavComponent {
  @Input() isOpen: boolean = false;
  @Input() topPx: number = 20;
  
  @Output() onToggle = new EventEmitter<boolean>();
  @Output() onLobby = new EventEmitter<void>();
  @Output() onDeposit = new EventEmitter<void>();

  constructor() {
    addIcons({ home, wallet, play });
  }

  // Drag logic is usually better kept in the parent or a directive, 
  // but for this component, we'll expose the events.
  handleToggle() {
    this.onToggle.emit(!this.isOpen);
  }
}
