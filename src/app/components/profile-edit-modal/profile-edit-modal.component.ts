import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonIcon, IonButton, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  callOutline, 
  mailOutline, 
  closeOutline,
  saveOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile-edit-modal',
  templateUrl: './profile-edit-modal.component.html',
  styleUrls: ['./profile-edit-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonModal, IonIcon, IonButton, IonInput]
})
export class ProfileEditModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() fullName = '';
  @Input() phone = '';
  @Input() email = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{fullName: string, phone: string, email: string}>();

  tempData = {
    fullName: '',
    phone: '',
    email: ''
  };

  constructor() {
    addIcons({ 
      personOutline, 
      callOutline, 
      mailOutline, 
      closeOutline,
      saveOutline
    });
  }

  ngOnInit() {
    this.tempData = {
      fullName: this.fullName,
      phone: this.phone,
      email: this.email
    };
  }

  // Update temp data when inputs change (since change detection might not trigger ngOnInit again)
  ngOnChanges() {
    this.tempData = {
      fullName: this.fullName,
      phone: this.phone,
      email: this.email
    };
  }

  dismiss() {
    this.close.emit();
  }

  submit() {
    this.save.emit(this.tempData);
    this.dismiss();
  }
}
