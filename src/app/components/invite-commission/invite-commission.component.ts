import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { CommissionCard } from '../../services/invite.service';

@Component({
  selector: 'app-invite-commission',
  template: `
    <div class="px-4 pb-20 space-y-4">
      @for (card of commissions; track card.title) {
        <div class="space-y-0 text-[13px]">
          <!-- Card Header & Timer -->
          <div class="flex items-center justify-between py-2">
             <div class="flex items-center text-[13px]">
                <span class="text-white font-bold">{{ card.title }}</span>
                @if (card.subtitle) {
                   <span class="text-[#6B7280] font-normal ml-1">(Time until next settlement {{ card.subtitle }})</span>
                }
             </div>
             <ion-icon name="chevron-forward" class="text-[#6B7280] text-[15px]"></ion-icon>
          </div>

          <!-- Card Content -->
          <div class="pb-4 border-b border-white/[0.05]">
             <div class="grid grid-cols-2 gap-4 mb-3">
                @for (stat of card.stats; track stat.label) {
                   <div class="flex flex-col gap-1">
                      <span class="text-[#6B7280] text-[12px] font-medium">{{ stat.label }}</span>
                      <span class="text-white text-[14px] font-semibold">{{ stat.value }}</span>
                   </div>
                }
             </div>

             <!-- Balances & Claim -->
             <div class="flex items-center justify-between">
                <div class="grid grid-cols-2 gap-4 flex-1">
                   <div class="flex flex-col gap-1">
                      <span class="text-[#6B7280] text-[12px] font-medium">Claimed</span>
                      <span class="text-white text-[14px] font-semibold">{{ card.claimedBalance }}</span>
                   </div>
                   <div class="flex flex-col gap-1">
                      <span class="text-[#6B7280] text-[12px] font-medium">Unclaimed</span>
                      <span class="text-[#F0A500] text-[14px] font-semibold">{{ card.unclaimedBalance }}</span>
                   </div>
                </div>
                <!-- Reduced text size on claim button, subtle bg -->
                <button (click)="claim.emit(card)" class="bg-[#ADB6C3] px-3.5 py-1.5 rounded-[5px] text-[#252830] font-medium text-[11px] shadow-sm ml-4 mb-0 transition-opacity active:opacity-60 cursor-pointer w-[62px]">
                   Claim
                </button>
             </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    button { outline: none; border: none; cursor: pointer; }
  `],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class InviteCommissionComponent {
  @Input() commissions: CommissionCard[] = [];
  @Output() claim = new EventEmitter<CommissionCard>();
}
