import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { EmptyRecordComponent } from '../empty-record/empty-record.component';
import { CustomDatePickerComponent } from '../custom-date-picker/custom-date-picker.component';

@Component({
  selector: 'app-performance-tab',
  templateUrl: './performance-tab.component.html',
  standalone: true,
  imports: [CommonModule, IonIcon, EmptyRecordComponent, CustomDatePickerComponent]
})
export class PerformanceTabComponent {
  filters = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month'];
  activeFilter = 'Today';
  isDropdownOpen = false;

  constructor() {
    addIcons({ chevronDown, chevronUp });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleConfirm(filter: string) {
    this.activeFilter = filter;
    this.isDropdownOpen = false;
  }

  handleCancel() {
    this.isDropdownOpen = false;
  }
}
