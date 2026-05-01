import { Component, Input, Output, EventEmitter, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonIcon, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { reloadOutline, caretDown, reorderThreeOutline, walletOutline, arrowDownOutline } from 'ionicons/icons';
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
  @Output() withdraw = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  isMenuOpen = false;
  showDropdown = false;

  constructor() {
    addIcons({ reloadOutline, caretDown, reorderThreeOutline, walletOutline, arrowDownOutline });
    this.sideMenuService.menuOpen$.subscribe(isOpen => {
      this.isMenuOpen = isOpen;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.deposit-btn-wrap')) {
      this.showDropdown = false;
    }
  }

  async toggleMenu() {
    await this.menuCtrl.toggle('main-menu');
  }

  onMenuClosed() {
    this.isMenuOpen = false;
  }

  onLogin(mode: 'login' | 'register') {
    this.login.emit(mode);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  onDeposit() {
    this.showDropdown = false;
    this.deposit.emit();
  }

  onWithdraw() {
    this.showDropdown = false;
    this.withdraw.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }
}
