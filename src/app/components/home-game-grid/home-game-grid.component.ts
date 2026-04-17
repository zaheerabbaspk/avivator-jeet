import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../services/home.service';

@Component({
  selector: 'app-home-game-grid',
  templateUrl: './home-game-grid.component.html',
  styleUrls: ['./home-game-grid.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeGameGridComponent {
  @Input() games: Game[] = [];
  @Output() gameClick = new EventEmitter<Game>();

  onGameClick(game: Game) {
    this.gameClick.emit(game);
  }
}
