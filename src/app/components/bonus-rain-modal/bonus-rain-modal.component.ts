import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { BonusService } from '../../services/bonus.service';

interface RedPacket {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  scale: number;
  isForeground: boolean;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  duration: number;
  scale: number;
  symbol: string;
}

@Component({
  selector: 'app-bonus-rain-modal',
  templateUrl: './bonus-rain-modal.component.html',
  styleUrls: ['./bonus-rain-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class BonusRainModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() openBonus = new EventEmitter<void>();

  packets: RedPacket[] = [];
  coins: Coin[] = [];
  isClaimed = false;
  isButtonPressed = false;
  sparklesVisible = false;
  claimedAmount = 5.02;
  displayedAmount = 0;

  private countInterval: any = null;

  public bonusService = inject(BonusService);
  private router = inject(Router);

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({ closeOutline });
  }

  ngOnInit() {
    this.generatePackets();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.isClaimed = false;
      this.isButtonPressed = false;
      this.sparklesVisible = false;
      this.displayedAmount = 0;
      if (this.countInterval) {
        clearInterval(this.countInterval);
        this.countInterval = null;
      }
      // Check eligibility every time the modal is opened
      this.bonusService.checkEligibility().then((bonus: any) => {
        this.claimedAmount = bonus.amount;
      });
    }
  }

  generatePackets() {
    this.packets = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3.5 + Math.random() * 4,
      rotation: Math.random() * 360,
      scale: 0.65 + Math.random() * 0.85,
      isForeground: Math.random() > 0.6 // 40% fall in front of the card
    }));
  }

  generateCoins() {
    const symbols = ['♠', '♣', '♥', '♦'];
    this.coins = Array.from({ length: 22 }, (_, i) => {
      // Tighter cluster, blasting from center
      const angle = (Math.PI * 0.5) + (Math.random() - 0.5) * Math.PI * 1.2; 
      const dist = 40 + Math.random() * 110;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rotation: (Math.random() - 0.5) * 60,
        delay: Math.random() * 0.15,
        duration: 1.0 + Math.random() * 0.5,
        scale: 0.85 + Math.random() * 0.4,
        symbol: symbols[Math.floor(Math.random() * symbols.length)]
      };
    });
  }

  confetti: any[] = [];
  generateConfetti() {
    const colors = ['#ff0055', '#00ffcc', '#ffcc00', '#9900ff', '#ff6600'];
    this.confetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 280,
      y: (Math.random() - 0.5) * 220,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360
    }));
  }

  playClaimSound() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      const tone = (freq: number, t: number, dur: number, vol: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.018);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t); osc.stop(t + dur);
      };

      const now = ctx.currentTime;
      tone(880, now + 0.00, 0.11, 0.28);
      tone(1100, now + 0.09, 0.11, 0.28);
      tone(1320, now + 0.18, 0.11, 0.30);
      tone(1760, now + 0.28, 0.18, 0.38);
      tone(1320, now + 0.44, 0.09, 0.22);
      tone(1760, now + 0.52, 0.26, 0.42);
      for (let i = 0; i < 6; i++) {
        tone(1000 + Math.random() * 900, now + 0.05 + i * 0.06, 0.07, 0.10);
      }
    } catch (e) { /* audio not supported */ }
  }

  /** Step-based counter — setInterval is Zone-patched, triggers CD automatically */
  startCountAnimation() {
    if (this.countInterval) clearInterval(this.countInterval);
    this.displayedAmount = 0;

    const totalSteps = 70;
    const target = this.claimedAmount;
    let step = 0;

    this.countInterval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      this.displayedAmount = parseFloat((eased * target).toFixed(2));
      this.cdr.markForCheck();

      if (step >= totalSteps) {
        clearInterval(this.countInterval);
        this.countInterval = null;
        this.displayedAmount = target;
        this.cdr.markForCheck();

        // Auto-close after 2 seconds
        setTimeout(() => {
          this.close();
        }, 2000);
      }
    }, 18); // 18ms × 70 steps ≈ 1.26s
  }

  async handleOpen() {
    if (this.isClaimed || this.isButtonPressed) return;

    // Check status
    const status = this.bonusService.bonusStatus();

    if (status === 'no_deposit') {
      this.close();
      this.router.navigate(['/deposit']);
      return;
    }

    if (status === 'already_claimed') {
      // You could show a toast here, for now just close
      this.close();
      return;
    }

    if (status === 'loading') {
      return; // wait for check to finish
    }

    // Attempt to claim
    try {
      await this.bonusService.claimDailyBonus();
    } catch (e) {
      console.error('Claim failed:', e);
      return;
    }

    // 1. Immediate Visual Feedback
    this.isButtonPressed = true;
    this.cdr.detectChanges();

    // 2. Play Audio
    this.playClaimSound();

    // 3. Transition to Reward Screen
    setTimeout(() => {
      this.isClaimed = true;
      this.isButtonPressed = false;
      this.sparklesVisible = true;
      this.generateCoins(); 
      this.generateConfetti();
      this.cdr.detectChanges();

      // 4. Trigger Animations
      setTimeout(() => {
        this.startCountAnimation();
      }, 250);

      setTimeout(() => {
        this.sparklesVisible = false;
        this.cdr.detectChanges();
      }, 1900);

      this.openBonus.emit();
    }, 120);
  }

  close() {
    if (this.countInterval) clearInterval(this.countInterval);
    this.isClaimed = false;
    this.sparklesVisible = false;
    this.isButtonPressed = false;
    this.cdr.markForCheck();
    this.modalClose.emit();
  }
}
