import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent]
})
export class SplashPage implements OnInit {
  private router = inject(Router);
  progress = signal<number>(0);

  ngOnInit() {
    this.startLoading();
  }

  private startLoading() {
    let current = 0;

    // Faster loading duration
    const tick = () => {
      let push = Math.random() * 3.0;

      if (current < 20) push = Math.random() * 8;
      else if (current > 40 && current < 60) push = 1.5; // Reduced pause
      else if (current > 85) push = Math.random() * 12;

      current += push;

      if (current >= 100) {
        current = 100;
        this.progress.set(100);
        this.navigateToHome();
        return;
      }

      this.progress.set(current);
      setTimeout(tick, 30); // Faster ticks
    };

    tick();
  }

  private navigateToHome() {
    // Shorter pause at 100%
    setTimeout(() => {
      this.router.navigate(['/home'], { replaceUrl: true });
    }, 400);
  }
}
