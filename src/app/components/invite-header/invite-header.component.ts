import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-invite-header',
  template: `
    <div class="flex flex-col bg-[#111419] border-b border-white/5 shadow-sm"
         style="padding-top: calc(var(--ion-safe-area-top, env(safe-area-inset-top, 0px)) + 5px);">
      <div class="flex items-center h-[52px] px-4">
        <button (click)="back.emit()" class="text-[#ADB6C3] text-[22px] flex items-center justify-center bg-transparent border-none active:opacity-60 transition-opacity">
          <ion-icon name="chevron-back"></ion-icon>
        </button>
        <div class="flex-1 text-center">
          <span class="text-white text-[17px] font-black tracking-tight">Invite</span>
        </div>
        <!-- Spacer for centering -->
        <div class="w-8"></div>
      </div>
    </div>
  `,
  styles: [`
    button { outline: none; -webkit-tap-highlight-color: transparent; cursor: pointer; }
  `],
  standalone: true,
  imports: [CommonModule, IonHeader, IonIcon]
})
export class InviteHeaderComponent {
  @Output() back = new EventEmitter<void>();
}
