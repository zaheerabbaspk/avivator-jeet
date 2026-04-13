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
    
    const tick = () => {
      // Logic for "hitch and jump" progress
      // pauses at certain levels to simulate real loading
      let push = Math.random() * 2;
      
      if (current < 10) push = Math.random() * 5;
      else if (current > 30 && current < 40) push = Math.random() * 0.5; // Simulate slow sync
      else if (current > 80 && current < 85) push = 0.1; // Simulate finalize
      else if (current > 85) push = Math.random() * 8; // Burst to finish
      
      current += push;
      
      if (current >= 100) {
        current = 100;
        this.progress.set(100);
        this.navigateToHome();
        return;
      }
      
      this.progress.set(current);
      setTimeout(tick, Math.random() * 100 + 20);
    };

    tick();
  }

  private navigateToHome() {
    // Slight pause at 100% for "Complete" feel
    setTimeout(() => {
      this.router.navigate(['/home'], { replaceUrl: true });
    }, 800);
  }
}
