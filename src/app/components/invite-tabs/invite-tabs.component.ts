import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invite-tabs',
  template: `
    <div class="w-full bg-[#111419] overflow-x-auto no-scrollbar border-b border-white/5 scroll-smooth">
      <div class="flex items-center px-4 h-[48px] gap-6 min-w-max">
        @for (tab of tabs; track tab.id) {
          <button 
            (click)="selectTab(tab.id)"
            class="h-full relative flex items-center justify-center transition-all duration-300 px-1"
            [class.active-tab]="activeTab === tab.id"
            [class.text-[#8E99A7]]="activeTab !== tab.id">
            <span class="text-[14px] font-bold whitespace-nowrap tracking-tight transition-transform duration-300"
                  [class.scale-105]="activeTab === tab.id">{{ tab.label }}</span>
            @if (activeTab === tab.id) {
              <div class="active-indicator"></div>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    button { outline: none; -webkit-tap-highlight-color: transparent; border: none; background: transparent; cursor: pointer; }
    .active-tab {
      color: #F1C15A;
      text-shadow: 0 0 10px rgba(241, 193, 90, 0.3);
    }
    .active-indicator {
      @apply absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#F1C15A] to-transparent rounded-full;
      box-shadow: 0 -2px 6px rgba(241, 193, 90, 0.5);
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class InviteTabsComponent {
  @Input() activeTab: string = 'home';
  @Input() tabs: { id: string; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'promotion', label: 'Promotion Sharing' },
    { id: 'data', label: 'My Data' },
    { id: 'performance', label: 'Performance' },
    { id: 'commission', label: 'Commission' },
    { id: 'subordinate', label: 'Subordinate Information' }
  ];
  @Output() tabChange = new EventEmitter<string>();

  selectTab(id: string) {
    this.tabChange.emit(id);
  }
}
