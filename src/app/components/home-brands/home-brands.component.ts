import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand } from '../../services/home.service';

@Component({
  selector: 'app-home-brands',
  templateUrl: './home-brands.component.html',
  styleUrls: ['./home-brands.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeBrandsComponent implements OnInit, OnDestroy {
  @Input() brands: Brand[] = [];
  
  currentBrandSlide = 0;
  private brandTimer: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    this.brandTimer = setInterval(() => {
      if (this.brands.length > 2) {
        this.currentBrandSlide = (this.currentBrandSlide + 1) % (this.brands.length - 2);
      }
    }, 3000);
  }

  stopTimer() {
    if (this.brandTimer) clearInterval(this.brandTimer);
  }

  goBrandSlide(index: number) {
    const maxIndex = this.brands.length - 3;
    this.currentBrandSlide = index > maxIndex ? maxIndex : index;
    this.startTimer();
  }
}
