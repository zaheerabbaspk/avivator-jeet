import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkSharp } from 'ionicons/icons';

@Component({
  selector: 'app-aviator-game-screen',
  templateUrl: './aviator-game-screen.component.html',
  styleUrls: ['./aviator-game-screen.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class AviatorGameScreenComponent {
  @Input() gameState: 'WAITING' | 'RUNNING' | 'CRASHED' = 'WAITING';
  @Input() currentMultiplier: number = 1.0;
  @Input() planeCoordinates: { x: number, y: number } = { x: 0, y: 100 };
  @Input() planeTailCoordinates: { left: number, top: number } = { left: 0, top: 100 };

  @Input() curvePath: string = '';
  @Input() visualMultiplier: number = 1.0;
  @Input() timeLeft: number = 0;
  @Input() activePlayers: number = 0;

  constructor() {
    addIcons({ checkmarkSharp });
  }
}
