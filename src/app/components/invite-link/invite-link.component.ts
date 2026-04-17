import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-invite-link',
  template: `
    <div class="px-4 py-4 space-y-4">
      <div class="flex items-center justify-between px-1 mb-2">
        <h3 class="text-white text-[13px] font-bold">Invite friends</h3>
        <span class="text-[#8E99A7] text-[11px] font-normal tracking-wide">My invitation code <span class="text-white font-bold ml-1">{{ referralCode }}</span> <ion-icon name="copy-outline" (click)="copy.emit(referralCode)" class="ml-1 text-[13px] text-[#F1C15A] cursor-pointer align-text-bottom"></ion-icon></span>
      </div>

      <!-- Main Link Card inside a subtle border-less wrapper if needed -->
      <div class="flex gap-4">
        <!-- QR Section -->
        <div class="w-[90px] shrink-0 flex flex-col items-center">
           <div class="w-[85px] aspect-square bg-white rounded-t-[5px] p-1.5 relative overflow-hidden">
              <img src="assets/qr_placeholder.png" class="w-full h-full object-contain" />
           </div>
           <!-- Yellow Save Label -->
           <div class="w-[85px] bg-[#F1C15A] py-[3px] rounded-b-[5px] text-center shadow-md cursor-pointer active:opacity-80">
               <span class="text-[#5A3D0A] text-[10px] font-medium leading-tight block">Save</span>
               <span class="text-[#5A3D0A] text-[10px] font-medium leading-tight block">invitation...</span>
           </div>
        </div>

        <!-- Link Section -->
        <div class="flex-1">
           <div>
              <span class="text-[#545E6D] text-[11px] font-medium block mb-[5px]">Referral link</span>
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-[#1A1D24] rounded-[6px] px-3 py-2 flex items-center justify-between border border-white/[0.04]">
                   <span class="text-[#8E99A7] text-[11px] truncate">{{ referralLink }}</span>
                   <ion-icon name="chevron-down-outline" class="text-[#8E99A7] text-[13px] ml-1"></ion-icon>
                </div>
                <ion-icon name="copy-outline" (click)="copy.emit(referralLink)" class="text-[#F1C15A] text-[17px] cursor-pointer pr-1"></ion-icon>
              </div>
           </div>

           <!-- Social Icons Scrollable (Swiper) -->
           <div class="flex items-center mt-4 overflow-x-auto no-scrollbar gap-4 pb-2">
              <div class="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0" (click)="share.emit('generic')">
                 <div class="w-[34px] h-[34px] rounded-full flex items-center justify-center border border-white/10 bg-transparent">
                    <ion-icon name="share-outline" class="text-[#F1C15A] text-[16px] mb-[2px] ml-[2px]"></ion-icon>
                 </div>
                 <span class="text-[#E0E0E0] text-[10px]">Share</span>
              </div>
              <div class="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0" (click)="share.emit('telegram')">
                 <div class="w-[34px] h-[34px] rounded-full bg-[#2AABEE] flex items-center justify-center">
                    <ion-icon name="paper-plane" class="text-white text-[16px]"></ion-icon>
                 </div>
                 <span class="text-[#E0E0E0] text-[10px]">Telegram</span>
              </div>
              <div class="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0" (click)="share.emit('facebook')">
                 <div class="w-[34px] h-[34px] rounded-full bg-[#1877F2] flex items-center justify-center">
                    <ion-icon name="logo-facebook" class="text-white text-[18px]"></ion-icon>
                 </div>
                 <span class="text-[#E0E0E0] text-[10px]">Facebook</span>
              </div>
              <div class="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0" (click)="share.emit('instagram')">
                 <div class="w-[34px] h-[34px] rounded-full bg-gradient-to-tr from-[#FFD600] via-[#FF0040] to-[#9900FF] flex items-center justify-center">
                    <ion-icon name="logo-instagram" class="text-white text-[18px]"></ion-icon>
                 </div>
                 <span class="text-[#E0E0E0] text-[10px]">instagram</span>
              </div>
              <div class="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0" (click)="share.emit('whatsapp')">
                 <div class="w-[34px] h-[34px] rounded-full bg-[#25D366] flex items-center justify-center">
                    <ion-icon name="logo-whatsapp" class="text-white text-[18px]"></ion-icon>
                 </div>
                 <span class="text-[#E0E0E0] text-[10px]">WhatsApp</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::-webkit-scrollbar { display: none; }
  `],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class InviteLinkComponent {
  @Input() referralCode: string = '';
  @Input() referralLink: string = '';
  
  @Output() copy = new EventEmitter<string>();
  @Output() share = new EventEmitter<string>();
}
