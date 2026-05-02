import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteBanner } from '../../services/invite.service';

@Component({
  selector: 'app-invite-banner',
  template: `
    <div class="relative w-full overflow-hidden py-3 group">
      <div #viewport 
           (scroll)="onScroll($event)" 
           (mousedown)="onMouseDown($event)"
           (mouseleave)="onMouseLeave()"
           (mouseup)="onMouseUp()"
           (mousemove)="onMouseMove($event)"
           class="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden gap-3 px-[10%] scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none">
        @for (banner of banners; track banner.id; let i = $index) {
          <div class="w-[80%] min-w-[280px] snap-center shrink-0 transition-all duration-300 py-1"
               [class.active-banner]="$index === activeIndex"
               [class.opacity-40]="$index !== activeIndex"
               [class.scale-[0.9]]="$index !== activeIndex">
            
            <!-- Thick Gold Border Wrapper -->
            <div class="aspect-[2.8/1] max-h-[140px] p-[1.5px] bg-gradient-to-b from-[#F1C15A] via-[#B48811] to-[#F1C15A] rounded-[18px] shadow-2xl shadow-black/80 relative">
               <div class="w-full h-[100px] rounded-[17px] overflow-hidden relative bg-[#1A1C22]">
                  <img [src]="banner.imgUrl" class="w-full h-full object-cover" />
                  
                  <!-- Overlay Content -->
                  <div class="absolute inset-0 p-2.5 flex flex-col justify-end bg-transparent pointer-events-none">
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

      <!-- Desktop Navigation Arrows -->
      <button (click)="scrollPrev()" class="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all z-20">
        <svg viewBox="0 0 24 24" class="w-5 h-5 fill-current"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>
      </button>
      <button (click)="scrollNext()" class="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all z-20">
        <svg viewBox="0 0 24 24" class="w-5 h-5 fill-current"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
      </button>
      
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
  @ViewChild('viewport') viewport!: ElementRef;
  activeIndex: number = 0;

  // Mouse Drag State
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  onScroll(event: any) {
    const el = event.target;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.offsetWidth * 0.8;
    const newIndex = Math.round(scrollLeft / itemWidth);
    
    if (newIndex !== this.activeIndex && newIndex >= 0 && newIndex < this.banners.length) {
      this.activeIndex = newIndex;
    }
  }

  // Mouse Drag Logic
  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.startX = e.pageX - this.viewport.nativeElement.offsetLeft;
    this.scrollLeft = this.viewport.nativeElement.scrollLeft;
    this.viewport.nativeElement.style.scrollSnapType = 'none'; // Disable snap during drag
    this.viewport.nativeElement.style.cursor = 'grabbing';
  }

  onMouseLeave() {
    this.isDown = false;
    this.viewport.nativeElement.style.scrollSnapType = 'x mandatory';
    this.viewport.nativeElement.style.cursor = 'grab';
  }

  onMouseUp() {
    this.isDown = false;
    this.viewport.nativeElement.style.scrollSnapType = 'x mandatory';
    this.viewport.nativeElement.style.cursor = 'grab';
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.viewport.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Scroll speed
    this.viewport.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  scrollPrev() {
    if (this.viewport) {
      const el = this.viewport.nativeElement;
      const itemWidth = el.offsetWidth * 0.8;
      el.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  }

  scrollNext() {
    if (this.viewport) {
      const el = this.viewport.nativeElement;
      const itemWidth = el.offsetWidth * 0.8;
      el.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  }
}
