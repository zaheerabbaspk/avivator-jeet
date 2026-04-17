import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeCircleOutline, volumeMedium, helpCircleOutline, receiptOutline,
  timeOutline, calendarOutline, peopleOutline, gift, cash,
  copyOutline, checkmarkCircle, closeOutline, checkmarkOutline,
  documentText, helpCircle, sparkles, close as closeIcon
} from 'ionicons/icons';
import { LuckyDrawService, LuckyTask, LuckyRecord, WheelItem } from '../../services/lucky-draw.service';

@Component({
  selector: 'app-lucky-draw-modal',
  templateUrl: './lucky-draw-modal.component.html',
  styleUrls: ['./lucky-draw-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class LuckyDrawModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();

  balance = 0;
  availableDraws = 0;
  tasks: LuckyTask[] = [];
  records: LuckyRecord[] = [];
  wheelItems: WheelItem[] = [];

  isSpinning = false;
  totalRotation = 0;

  constructor(private luckyService: LuckyDrawService) {
    addIcons({ volumeMedium, helpCircleOutline, receiptOutline, copyOutline, close: closeIcon, closeCircleOutline, timeOutline, calendarOutline, peopleOutline, gift, cash, checkmarkCircle, closeOutline, checkmarkOutline, documentText, helpCircle, sparkles });
  }

  ngOnInit() {
    this.luckyService.getBalance().subscribe(b => this.balance = b);
    this.luckyService.getAvailableDraws().subscribe(d => this.availableDraws = d);
    this.luckyService.getTasks().subscribe(t => this.tasks = t);
    this.luckyService.getRecords().subscribe(r => this.records = r);
    this.wheelItems = this.luckyService.getWheelItems();
  }

  close() {
    if (this.isSpinning) return;
    this.modalClose.emit();
  }


  handleClaim() {
    // Simple visual feedback for now
    console.log('Claiming rewards...');
  }

  handleTask(task: any) {
    console.log('Handling task:', task.title);
  }

  spin() {
    if (this.isSpinning || this.availableDraws <= 0) return;

    this.isSpinning = true;
    const spins = 10; // Extra spins for more drama
    const randomStopAngle = Math.floor(Math.random() * 360);

    // We update totalRotation so the next spin continues from where it stopped
    this.totalRotation += (360 * spins) + randomStopAngle;

    // Trigger the service logic (reduces draws, sets up record)
    this.luckyService.spin();

    setTimeout(() => {
      this.isSpinning = false;
    }, 4500); // Wait for transition duration defined in SCSS
  }
}
