import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, volumeMediumOutline, volumeMuteOutline } from 'ionicons/icons';
import { SoundService } from '../../../services/sound.service';

@Component({
  selector: 'app-aviator-header',
  templateUrl: './aviator-header.component.html',
  styleUrls: ['./aviator-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class AviatorHeaderComponent {
  @Input() balance: number = 0;
  @Input() isLoading: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();
  
  soundService = inject(SoundService);

  constructor() {
    addIcons({ menuOutline, volumeMediumOutline, volumeMuteOutline });
  }

  toggleMute() {
    this.soundService.toggleMute();
  }
}
