import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invite-tabs',
  template: `
    <div class="w-full bg-[#111419] overflow-x-auto no-scrollbar border-b border-white/5">
      <div class="flex items-center min-w-max px-4 h-[45px] gap-2">
        @for (tab of tabs; track tab.id) {
          <button 
            (click)="selectTab(tab.id)"
            class="px-1 h-full relative flex items-center justify-center transition-all duration-300"
            [class.text-[#F1C15A]]="activeTab === tab.id"
            [class.text-[#8E99A7]]="activeTab !== tab.id">
            <span class="text-[13px] font-bold whitespace-nowrap tracking-tight">{{ tab.label }}</span>
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
    .active-indicator {
      @apply absolute bottom-[2px] left-0 right-0 h-[2.5px] bg-[#F1C15A] rounded-full;
      box-shadow: 0 -1px 4px rgba(241, 193, 90, 0.4);
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
