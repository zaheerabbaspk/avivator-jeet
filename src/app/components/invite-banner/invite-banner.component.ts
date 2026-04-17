import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteBanner } from '../../services/invite.service';

@Component({
  selector: 'app-invite-banner',
  template: `
    <div class="relative w-full overflow-hidden py-3">
      <div #viewport (scroll)="onScroll($event)" class="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden gap-4 px-[15vw]">
        @for (banner of banners; track banner.id; let i = $index) {
          <div class="w-[70vw] snap-center shrink-0 transition-all duration-300 py-1"
               [class.active-banner]="$index === activeIndex"
               [class.opacity-40]="$index !== activeIndex"
               [class.scale-[0.9]]="$index !== activeIndex">
            
            <!-- Thick Gold Border Wrapper -->
            <div class="aspect-[2.8/1] max-h-[140px] p-[1.5px] bg-gradient-to-b from-[#F1C15A] via-[#B48811] to-[#F1C15A] rounded-[18px] shadow-2xl shadow-black/80 relative">
               <div class="w-full h-[100px] rounded-[17px] overflow-hidden relative bg-[#1A1C22]">
                  <img [src]="banner.imgUrl" class="w-full h-full object-cover" />
                  
                  <!-- Overlay Content (Text Removed) -->
                  <div class="absolute inset-0 p-2.5 flex flex-col justify-end bg-transparent pointer-events-none">
                     <!-- Share Button Icon -->
                     <div class="absolute bottom-2 right-2 w-7 h-7 bg-gradient-to-b from-[#F1C15A] to-[#B48811] rounded-full flex items-center justify-center shadow-lg pointer-events-auto active:scale-95 transition-all border border-black/20">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-white shadow-sm">
                           <path d="M18.5,13.5L13.5,18.5V14.5C9,14.5 5.5,15.5 2.5,19.5C3.5,15 5.5,10.5 13.5,9.5V5.5L18.5,10.5L18.5,13.5Z" />
                        </svg>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        }
      </div>
      
      <!-- Indicators -->
      <div class="flex justify-center gap-1.5 mt-2">
        @for (b of banners; track b.id; let i = $index) {
          <div class="w-1.5 h-1.5 rounded-full transition-all duration-300"
               [class.bg-[#F1C15A]]="i === activeIndex"
               [class.w-4]="i === activeIndex"
               [class.bg-[#252830]]="i !== activeIndex"></div>
        }
      </div>
    </div>
  `,
  styles: [`
    ::-webkit-scrollbar { display: none; }
    .carousel-container { -ms-overflow-style: none; scrollbar-width: none; }
    .active-banner { z-index: 10; transform: scale(1.0); }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class InviteBannerComponent {
  @Input() banners: InviteBanner[] = [];
  activeIndex: number = 0;

  onScroll(event: any) {
    const el = event.target;
    const scrollLeft = el.scrollLeft;
    const width = el.scrollWidth / this.banners.length;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== this.activeIndex) {
      this.activeIndex = newIndex;
    }
  }
}
