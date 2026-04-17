import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { Mission } from '../../services/offers.service';

@Component({
  selector: 'app-offer-mission',
  templateUrl: './offer-mission.component.html',
  styleUrls: ['./offer-mission.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class OfferMissionComponent {
  @Input() activeMissionTab: 'daily' | 'weekly' = 'daily';
  @Input() missions: Mission[] = [];
  @Input() isLoadingMissions: boolean = false;

  @Output() missionChannelChange = new EventEmitter<'daily' | 'weekly'>();
  @Output() refreshMissions = new EventEmitter<void>();
  @Output() claimMission = new EventEmitter<Mission>();

  setMissionTab(tab: 'daily' | 'weekly') {
    this.missionChannelChange.emit(tab);
  }
}
