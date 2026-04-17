import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-banners',
  templateUrl: './home-banners.component.html',
  styleUrls: ['./home-banners.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeBannersComponent implements OnInit, OnDestroy {
  @Input() slides: string[] = [];
  
  currentSlide = 0;
  private slideTimer: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    this.slideTimer = setInterval(() => {
      if (this.slides.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      }
    }, 2000);
  }

  stopTimer() {
    if (this.slideTimer) clearInterval(this.slideTimer);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.startTimer();
  }
}
