import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, copyOutline, checkmarkCircle, globeOutline, checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-find-us-modal',
  templateUrl: './find-us-modal.component.html',
  styleUrls: ['./find-us-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  // Force re-evaluation by explicitly declaring props used in template
})
export class FindUsModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() didDismiss = new EventEmitter<void>();

  dontShowToday = false;

  private readonly allUrls = [
    'bp999.site', 'bp999.me', 'bp999.org',
    'www.bp999.site', 'www.bp999.me', 'www.bp999.org'
  ];

  constructor() {
    addIcons({ closeOutline, copyOutline, checkmarkCircle, globeOutline, checkmark });
  }

  ngOnInit() {
    // Check if user already checked "don't show today"
    const savedDate = localStorage.getItem('findUsHideDate');
    const today = new Date().toDateString();
    if (savedDate === today) {
      this.dontShowToday = true;
    }
  }

  dismiss() {
    if (this.dontShowToday) {
      localStorage.setItem('findUsHideDate', new Date().toDateString());
    }
    this.didDismiss.emit();
  }

  toggleDontShow() {
    this.dontShowToday = !this.dontShowToday;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied:', text);
    });
  }

  copyAll() {
    this.copyToClipboard(this.allUrls.join('\n'));
  }
}

