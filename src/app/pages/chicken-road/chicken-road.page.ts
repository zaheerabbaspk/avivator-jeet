import { Component, OnInit, OnDestroy, ElementRef, ViewChild, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import Phaser from 'phaser';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chicken-road',
  templateUrl: './chicken-road.page.html',
  styleUrls: ['./chicken-road.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ChickenRoadPage implements OnInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  private authService = inject(AuthService);
  balance = this.authService.balance$;

  game: Phaser.Game | null = null;
  
  // Game State
  gameState = signal<'IDLE' | 'PLAYING' | 'CASHED_OUT' | 'CRASHED'>('IDLE');
  betAmount = signal<number>(10);
  difficulty = signal<'Easy' | 'Medium' | 'Hard' | 'Hardcore'>('Medium');
  currentLane = signal<number>(0);
  
  // Multipliers for lanes
  baseMultipliers = [1.03, 1.07, 1.12, 1.17, 1.23, 1.29, 1.36, 1.45, 1.55, 1.70];
  multipliers = computed(() => {
    const diff = this.difficulty();
    const mult = diff === 'Easy' ? 1 : diff === 'Medium' ? 1.5 : diff === 'Hard' ? 2 : 3;
    return this.baseMultipliers.map(m => parseFloat(((m - 1) * mult + 1).toFixed(2)));
  });

  currentMultiplier = computed(() => {
    const lane = this.currentLane();
    if (lane === 0) return 1.00;
    return this.multipliers()[lane - 1] || 1.00;
  });

  potentialWin = computed(() => {
    return (this.betAmount() * this.currentMultiplier()).toFixed(2);
  });

  ngOnInit() {
    this.initGame();
  }

  ngOnDestroy() {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  initGame() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      parent: this.gameContainer.nativeElement,
      backgroundColor: '#2A2E3D',
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.game = new Phaser.Game(config);
    // Pass context to scene
    this.game.events.on('ready', () => {
        const scene = this.game?.scene.getScene('default');
        if (scene) {
            (scene as any).angularContext = this;
        }
    });
  }

  // --- Phaser Scene Methods ---
  preload(this: Phaser.Scene) {
    // Generate simple SVG textures
    const chickenSvg = `
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="15" fill="#fff" />
        <circle cx="25" cy="15" r="3" fill="#000" />
        <path d="M 28 20 L 35 25 L 28 30 Z" fill="#FFA500" />
        <path d="M 15 5 L 20 10 L 25 5 Z" fill="#FF0000" />
      </svg>
    `;
    this.textures.addBase64('chicken', 'data:image/svg+xml;base64,' + btoa(chickenSvg));

    const carSvg = `
      <svg width="30" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="30" height="60" rx="5" fill="#00ffff" />
        <rect x="5" y="10" width="20" height="15" rx="2" fill="#000" />
        <rect x="5" y="35" width="20" height="15" rx="2" fill="#000" />
      </svg>
    `;
    this.textures.addBase64('car', 'data:image/svg+xml;base64,' + btoa(carSvg));
  }

  create(this: Phaser.Scene) {
    const ctx = (this as any).angularContext as ChickenRoadPage;
    (this as any).lanes = [];
    (this as any).cars = this.physics.add.group();

    // Draw lanes
    const laneWidth = 80;
    for (let i = 0; i < 10; i++) {
        const x = 100 + i * laneWidth;
        // Lane background
        const rect = this.add.rectangle(x, 200, laneWidth - 10, 400, 0x3A3F55);
        (this as any).lanes.push(x);
        
        // Multiplier text
        this.add.text(x, 40, ctx.multipliers()[i] + 'x', {
            fontFamily: 'Arial', fontSize: '16px', color: '#8892B0', fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    // Add Chicken
    const chicken = this.physics.add.sprite(50, 200, 'chicken');
    chicken.setCollideWorldBounds(true);
    (this as any).chicken = chicken;

    // Collision
    this.physics.add.overlap(chicken, (this as any).cars, () => {
        if (ctx.gameState() === 'PLAYING') {
            ctx.crash();
        }
    });

    // Spawn cars timer
    (this as any).carTimer = this.time.addEvent({
        delay: 1000,
        callback: () => {
            if (ctx.gameState() !== 'PLAYING') return;
            const diff = ctx.difficulty();
            const spawnChance = diff === 'Easy' ? 0.3 : diff === 'Medium' ? 0.5 : diff === 'Hard' ? 0.7 : 0.9;
            
            for (let i = 1; i < 10; i++) {
                if (Math.random() < spawnChance) {
                    const x = (this as any).lanes[i];
                    const y = Math.random() > 0.5 ? -50 : 450;
                    const speed = (Math.random() * 100 + 100) * (y < 0 ? 1 : -1) * (diff === 'Hardcore' ? 1.5 : 1);
                    const car = (this as any).cars.create(x, y, 'car');
                    car.setVelocityY(speed);
                    
                    // Cleanup cars out of bounds
                    this.time.delayedCall(5000, () => {
                        if (car && car.active) car.destroy();
                    });
                }
            }
        },
        loop: true
    });
  }

  update(this: Phaser.Scene) {
      // Game loop
  }

  // --- Angular Actions ---

  setDifficulty(diff: 'Easy' | 'Medium' | 'Hard' | 'Hardcore') {
      if (this.gameState() !== 'IDLE') return;
      this.difficulty.set(diff);
      // Update texts in Phaser
      if (this.game) {
          const scene = this.game.scene.getScene('default');
          scene?.scene.restart();
          this.game.events.once('ready', () => {
              const newScene = this.game?.scene.getScene('default');
              if (newScene) (newScene as any).angularContext = this;
          });
      }
  }

  setBetAmount(amount: number) {
      if (this.gameState() !== 'IDLE') return;
      this.betAmount.set(amount);
  }

  async play() {
      if (this.gameState() !== 'IDLE' && this.gameState() !== 'CASHED_OUT' && this.gameState() !== 'CRASHED') return;
      
      try {
          await this.authService.updateBalance(-this.betAmount());
      } catch (e) {
          return; // Insufficient balance
      }

      this.gameState.set('PLAYING');
      this.currentLane.set(0);

      const scene = this.game?.scene.getScene('default');
      if (scene) {
          const chicken = (scene as any).chicken;
          chicken.setPosition(50, 200);
          chicken.setAlpha(1);
          chicken.setTint(0xffffff);
          
          // Clear old cars
          (scene as any).cars.clear(true, true);
      }
  }

  moveNext() {
      if (this.gameState() !== 'PLAYING') return;
      const nextLane = this.currentLane() + 1;
      
      const scene = this.game?.scene.getScene('default');
      if (scene) {
          const chicken = (scene as any).chicken;
          const targetX = (scene as any).lanes[nextLane - 1];
          
          // Jump animation
          scene.tweens.add({
              targets: chicken,
              x: targetX,
              y: chicken.y - 20,
              yoyo: true,
              duration: 150,
              ease: 'Sine.easeInOut'
          });
          
          this.currentLane.set(nextLane);
      }
  }

  async cashOut() {
      if (this.gameState() !== 'PLAYING') return;
      if (this.currentLane() === 0) return;

      this.gameState.set('CASHED_OUT');
      const winAmount = parseFloat(this.potentialWin());
      await this.authService.updateBalance(winAmount);
      
      // Show success
  }

  crash() {
      this.gameState.set('CRASHED');
      
      const scene = this.game?.scene.getScene('default');
      if (scene) {
          const chicken = (scene as any).chicken;
          chicken.setTint(0xff0000);
          scene.cameras.main.shake(200, 0.05);
      }
  }
}
