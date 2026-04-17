import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { VipTier, UnclaimedSummary } from '../../services/offers.service';

@Component({
  selector: 'app-offer-vip',
  templateUrl: './offer-vip.component.html',
  styleUrls: ['./offer-vip.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class OfferVipComponent {
  @ViewChild('vipCarouselViewport') vipCarouselViewport!: ElementRef;
  @ViewChild('vipSelector') vipSelector!: ElementRef;

  @Input() vipTiers: VipTier[] = [];
  @Input() activeVipLevel: number = 0;
  @Input() activeVipData: VipTier | null = null;
  @Input() unclaimed: UnclaimedSummary | null = null;
  @Input() isLoadingUnclaimed: boolean = false;

  @Output() levelChange = new EventEmitter<number>();
  @Output() refreshUnclaimed = new EventEmitter<void>();
  @Output() viewHistory = new EventEmitter<void>();
  @Output() claimBonus = new EventEmitter<string>();

  scrollToLevel(lvl: number) {
    this.levelChange.emit(lvl);
    this.syncScroll(lvl);
  }

  onVipScroll(event: any) {
    const scrollLeft = event.target.scrollLeft;
    const width = event.target.clientWidth;
    const center = scrollLeft + width / 2;
    
    // Find the closest slide to the center
    const slides = event.target.children;
    let minDistance = Infinity;
    let closestLvl = 0;

    for (let i = 0; i < slides.length; i++) {
      const slideCenter = slides[i].offsetLeft + slides[i].clientWidth / 2;
      const distance = Math.abs(center - slideCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestLvl = i;
      }
    }

    if (closestLvl !== this.activeVipLevel) {
      this.levelChange.emit(closestLvl);
      this.scrollToSelector(closestLvl);
    }
  }

  private syncScroll(lvl: number) {
    if (this.vipCarouselViewport) {
      const el = this.vipCarouselViewport.nativeElement;
      const slide = el.children[lvl];
      if (slide) {
        const scrollLeft = slide.offsetLeft - el.clientWidth / 2 + slide.clientWidth / 2;
        el.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
    this.scrollToSelector(lvl);
  }

  private scrollToSelector(lvl: number) {
    if (this.vipSelector) {
      const el = this.vipSelector.nativeElement;
      const btn = el.children[lvl];
      if (btn) {
        const scrollLeft = btn.offsetLeft - el.clientWidth / 2 + btn.clientWidth / 2;
        el.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }

  getIconArray(count: number): number[] {
    return Array(count).fill(0);
  }
}
