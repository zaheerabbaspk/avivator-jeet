
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-playing-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <div class="card-container" [class.flipped]="revealed" [class.highlight]="highlight" [class.disabled]="disabled">
      <div class="card-inner">
        <!-- Front (Face) -->
        <div class="card-face card-front" [ngClass]="getSuitColor(suit)">
          <div class="top-left">
            <span class="rank">{{ rank }}</span>
            <span class="suit-icon">{{ getSuitSymbol(suit) }}</span>
          </div>
          <div class="center-suit">
             {{ getSuitSymbol(suit) }}
          </div>
          <div class="bottom-right">
            <span class="rank">{{ rank }}</span>
            <span class="suit-icon">{{ getSuitSymbol(suit) }}</span>
          </div>
          
          <div *ngIf="highlight" class="winner-glow"></div>
        </div>

        <!-- Back -->
        <div class="card-face card-back">
          <div class="pattern"></div>
          <ion-icon name="help-circle-outline"></ion-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 15vw;
      height: 22.5vw;
      max-width: 60px;
      max-height: 90px;
      perspective: 1000px;
    }

    .card-container {
      width: 100%;
      height: 100%;
      position: relative;
      transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
      transform-style: preserve-3d;
      cursor: pointer;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }

    .card-container.flipped .card-inner {
      transform: rotateY(180deg);
    }

    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1vw;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      overflow: hidden;
    }

    .card-front {
      background: white;
      transform: rotateY(180deg);
      border: 1px solid #ddd;
    }

    .card-back {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border: 1.5px solid #4a90e2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.3);
    }
    
    .pattern {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        background-image: radial-gradient(#fff 1px, transparent 1px);
        background-size: 4px 4px;
    }

    .text-red { color: #d32f2f; }
    .text-black { color: #212121; }

    .top-left {
      position: absolute;
      top: 0.5vw;
      left: 0.5vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
    }
    .bottom-right {
      position: absolute;
      bottom: 0.5vw;
      right: 0.5vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
      transform: none;
    }
    
    .rank { font-weight: 900; font-size: 2.8vw; }
    .suit-icon { font-size: 2.8vw; }
    
    @media (min-width: 400px) {
        .rank { font-size: 11px; }
        .suit-icon { font-size: 11px; }
    }
    
    .center-suit {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5vw;
        max-font-size: 24px;
        opacity: 0.2;
    }

    @media (min-width: 400px) {
        .center-suit { font-size: 20px; }
    }

    .highlight .card-front {
      box-shadow: 0 0 15px 4px rgba(34, 197, 94, 0.6);
      border-color: #22c55e;
      animation: pulseGlow 1.5s infinite;
    }

    @keyframes pulseGlow {
      0% { box-shadow: 0 0 15px 4px rgba(34, 197, 94, 0.6); }
      50% { box-shadow: 0 0 25px 8px rgba(34, 197, 94, 0.8); }
      100% { box-shadow: 0 0 15px 4px rgba(34, 197, 94, 0.6); }
    }
    
    @media (max-width: 380px) {
      :host {
        width: 14.5vw;
        height: 21.5vw;
      }
      .rank, .suit-icon { font-size: 2.6vw; }
      .center-suit { font-size: 4.8vw; }
    }

    @media (max-width: 330px) {
      :host {
        width: 13.5vw;
        height: 20vw;
      }
    }

    .disabled { pointer-events: none; }
  `]
})
export class PlayingCardComponent {
  @Input() rank: string | number = '';
  @Input() suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' = 'spades';
  @Input() revealed: boolean = false;
  @Input() highlight: boolean = false;
  @Input() disabled: boolean = false;

  getSuitSymbol(suit: string): string {
    const symbols: any = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    return symbols[suit] || '';
  }

  getSuitColor(suit: string): string {
    return (suit === 'hearts' || suit === 'diamonds') ? 'text-red' : 'text-black';
  }
}
