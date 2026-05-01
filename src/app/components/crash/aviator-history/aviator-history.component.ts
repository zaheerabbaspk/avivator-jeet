import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-aviator-history',
  templateUrl: './aviator-history.component.html',
  styleUrls: ['./aviator-history.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class AviatorHistoryComponent {
  @Input() history: number[] = [];
  @Input() isLoading: boolean = false;
  @Input() isExpanded: boolean = false;
  @Output() toggleExpand = new EventEmitter<void>();

  constructor() {
    addIcons({ ellipsisHorizontal, closeOutline });
  }

  getMultiplierColor(val: number): string {
    if (val < 2.0) return 'text-[#34b4ff]'; // Blue for under 2x
    if (val < 10.0) return 'text-[#913ef8]'; // Purple for 2x - 10x
    return 'text-[#c017b2]'; // Pink/Red for 10x and above
  }
}
