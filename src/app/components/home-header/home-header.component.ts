import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonIcon, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { reloadOutline, caretDown, reorderThreeOutline } from 'ionicons/icons';
import { SideMenuService } from '../../services/side-menu.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class HomeHeaderComponent {
  private menuCtrl = inject(MenuController);
  private sideMenuService = inject(SideMenuService);
  @Input() isLoggedIn = false;
  @Input() userBalance = 0;
  @Input() isLoadingBalance = false;

  @Output() login = new EventEmitter<'login' | 'register'>();
  @Output() deposit = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  isMenuOpen = false;

  constructor() {
    addIcons({ reloadOutline, caretDown, reorderThreeOutline });
    this.sideMenuService.menuOpen$.subscribe(isOpen => {
      this.isMenuOpen = isOpen;
    });
  }

  async toggleMenu() {
    await this.menuCtrl.toggle('main-menu');
  }

  // To ensure the icon resets if menu is closed by clicking backdrop
  onMenuClosed() {
    this.isMenuOpen = false;
  }

  onLogin(mode: 'login' | 'register') {
    this.login.emit(mode);
  }

  onDeposit() {
    this.deposit.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }
}
