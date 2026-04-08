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
    const duration = 4000; // 4 seconds
    const interval = 40; // update every 40ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      this.progress.update(p => {
        if (p >= 100) {
          clearInterval(timer);
          this.navigateToHome();
          return 100;
        }
        return p + step;
      });
    }, interval);
  }

  private navigateToHome() {
    // Add a small delay for the "Complete" state before transition
    setTimeout(() => {
      this.router.navigate(['/home'], { replaceUrl: true });
    }, 500);
  }
}
