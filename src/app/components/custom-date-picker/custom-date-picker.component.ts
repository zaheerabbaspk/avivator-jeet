import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonPickerLegacy } from '@ionic/angular/standalone';

// Note: Using a custom logic for arrays, but wait, Ionic 8 uses IonPicker and IonPickerColumn. Let's import them.
import { IonPicker, IonPickerColumn, IonPickerColumnOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styles: [`
    .picker-container {
      --background: transparent !important;
      background: transparent !important;
    }
    ion-picker {
      --background: transparent !important;
      background: transparent !important;
    }
    ion-picker-column {
      --background: transparent !important;
      background: transparent !important;
    }
    /* ionic 8 shadow parts / color overrides */
    ion-picker-column-option {
      color: #8E99A7;
      font-size: 14px;
      font-weight: 500;
    }
    ion-picker-column-option::part(button) {
      color: #8E99A7;
    }
    ion-picker-column-option.option-active,
    ion-picker-column-option[aria-selected="true"],
    ion-picker-column-option[class*="selected"],
    ion-picker-column-option[class*="active"] {
      color: #ffffff !important;
      font-weight: bold !important;
    }
    ion-picker-column-option.option-active::part(button),
    ion-picker-column-option[aria-selected="true"]::part(button) {
      color: #ffffff !important;
      font-weight: bold !important;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonPicker, IonPickerColumn, IonPickerColumnOption]
})
export class CustomDatePickerComponent implements OnInit {
  @Input() activeFilter: string = 'Today';
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  filters = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'All'];

  years: string[] = [];
  months: string[] = [];
  days: string[] = [];

  startYear = '2025';
  startMonth = '03';
  startDay = '13';

  endYear = '2026';
  endMonth = '04';
  endDay = '14';

  ngOnInit() {
    // Populate simple arrays
    for (let i = 2020; i <= 2030; i++) this.years.push(i.toString());
    for (let i = 1; i <= 12; i++) this.months.push(i.toString().padStart(2, '0'));
    for (let i = 1; i <= 31; i++) this.days.push(i.toString().padStart(2, '0'));
  }

  selectFilter(filter: string) {
    this.activeFilter = filter;
  }

  onConfirm() {
    this.confirm.emit(this.activeFilter);
  }

  onCancel() {
    this.cancel.emit();
  }
}
