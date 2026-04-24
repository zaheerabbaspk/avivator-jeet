import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonIcon, ToastController } from '@ionic/angular/standalone';
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
  private toastCtrl = inject(ToastController);

  constructor(
    private luckyService: LuckyDrawService,
    private router: Router
  ) {
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

  async handleClaim() {
    if (this.balance <= 0) return;
    
    const result = await this.luckyService.claimBalance();
    
    const toast = await this.toastCtrl.create({
      message: result.message || `Successfully claimed Rs ${result.amount}`,
      duration: 3000,
      position: 'top',
      color: result.success ? 'success' : 'danger'
    });
    await toast.present();
  }

  handleTask(task: any) {
    if (task.id === 'task3' || task.actionText?.includes('invite')) {
      this.goInvite();
    }
  }

  goInvite() {
    this.close();
    this.router.navigate(['/invite']);
  }

  async spin() {
    if (this.isSpinning || this.availableDraws <= 0) return;

    const result = await this.luckyService.spin();
    if (result.success) {
      this.isSpinning = true;
      const spins = 5; // Rotation loops
      const sliceAngle = 360 / this.wheelItems.length;
      
      // Calculate rotation to land on result.index
      // We subtract the slice angle * index to align the pointer with the center of the slice
      const stopAngle = (result.index * sliceAngle);
      this.totalRotation += (360 * spins) + (360 - stopAngle);

      setTimeout(() => {
        this.isSpinning = false;
      }, 4500); 
    }
  }

  share(platform: string) {
    if (navigator.share) {
      navigator.share({
        title: 'Join bp999!',
        text: 'Special invitation reward waiting for you!',
        url: 'https://5no777.com/?id=9999999' // Dynamic link should go here later
      }).catch(console.error);
    } else {
      console.log('Share API not supported. Would share to:', platform);
    }
  }
}
