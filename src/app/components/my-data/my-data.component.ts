import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDataStats } from '../../services/invite.service';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MyDataComponent {
  @Input() dataStats!: MyDataStats;

  filters = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month'];
  activeFilter = 'Today';

  selectFilter(filter: string) {
    this.activeFilter = filter;
  }

}
