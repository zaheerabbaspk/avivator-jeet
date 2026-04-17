import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { reloadOutline, caretDown } from 'ionicons/icons';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class HomeHeaderComponent {
  @Input() isLoggedIn = false;
  @Input() userBalance = 0;
  @Input() isLoadingBalance = false;

  @Output() login = new EventEmitter<void>();
  @Output() deposit = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  constructor() {
    addIcons({ reloadOutline, caretDown });
  }

  onLogin() {
    this.login.emit();
  }

  onDeposit() {
    this.deposit.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }
}
