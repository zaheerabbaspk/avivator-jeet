import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  shareOutline, 
  paperPlane, 
  logoFacebook, 
  logoInstagram, 
  logoWhatsapp, 
  chevronDownOutline, 
  copyOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-invite-link',
  template: `
    <div class="px-4 py-4 space-y-4">
      <div class="flex items-center justify-between px-1 mb-2">
        <h3 class="text-white text-[13px] font-bold">Invite friends</h3>
        <span class="text-[#8E99A7] text-[11px] font-normal tracking-wide">My invitation code <span class="text-white font-bold ml-1">{{ referralCode }}</span> <ion-icon name="copy-outline" (click)="copy.emit(referralCode)" class="ml-1 text-[13px] text-[#F1C15A] cursor-pointer align-text-bottom"></ion-icon></span>
      </div>

      <!-- Main Link Card inside a subtle border-less wrapper if needed -->
      <div class="main-link-layout">
        <!-- QR Section -->
        <div class="qr-container">
           <div class="qr-box">
              <img src="assets/qr_placeholder.png" class="w-full h-full object-contain" />
           </div>
           <!-- Yellow Save Label -->
           <div class="qr-button">
               <span class="btn-text">Save</span>
               <span class="btn-text">invitation...</span>
           </div>
        </div>

        <!-- Link Section -->
        <div class="link-section">
           <div>
              <span class="text-[#545E6D] text-[11px] font-medium block mb-[5px]">Referral link</span>
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-[#1A1D24] rounded-[6px] px-3 py-2 flex items-center justify-between border border-white/[0.04] overflow-hidden">
                   <span class="text-[#8E99A7] text-[11px] truncate">{{ referralLink }}</span>
                   <ion-icon name="chevron-down-outline" class="text-[#8E99A7] text-[13px] ml-1 shrink-0"></ion-icon>
                </div>
                <ion-icon name="copy-outline" (click)="copy.emit(referralLink)" class="text-[#F1C15A] text-[17px] cursor-pointer pr-1 shrink-0"></ion-icon>
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
                 <span class="text-[#E0E0E0] text-[10px]">Instagram</span>
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
    .no-scrollbar::-webkit-scrollbar { display: none; }
    
    .main-link-layout {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .qr-container {
      width: clamp(80px, 25vw, 100px);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .qr-box {
      width: 100%;
      aspect-ratio: 1;
      background: white;
      border-radius: 6px 6px 0 0;
      padding: clamp(4px, 1.5vw, 8px);
      position: relative;
    }

    .qr-button {
      width: 100%;
      background: #F1C15A;
      padding: clamp(3px, 1vw, 5px) 0;
      border-radius: 0 0 6px 6px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .btn-text {
      color: #5A3D0A;
      font-size: clamp(8px, 2.2vw, 10px);
      font-weight: 800;
      line-height: 1.1;
      display: block;
      white-space: nowrap;
      padding: 0 2px;
    }

    .link-section {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    @media (max-width: 360px) {
      .main-link-layout {
        gap: 12px;
      }
      
      .qr-container {
        width: 85px;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class InviteLinkComponent {
  @Input() referralCode: string = '';
  @Input() referralLink: string = '';
  
  @Output() copy = new EventEmitter<string>();
  @Output() share = new EventEmitter<string>();

  constructor() {
    addIcons({ 
      shareOutline, 
      paperPlane, 
      logoFacebook, 
      logoInstagram, 
      logoWhatsapp, 
      chevronDownOutline, 
      copyOutline 
    });
  }
}
