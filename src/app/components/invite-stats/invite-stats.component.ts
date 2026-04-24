import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { AgentStats, InviteStats } from '../../services/invite.service';

@Component({
  selector: 'app-invite-stats',
  template: `
    <div class="px-4 pt-4 pb-1">
      <!-- Agent Card -->
      <div class="bg-[#1A1C22]/80 rounded-[10px] p-3 shadow-md border border-white/[0.02]">
        
        <!-- Row 1: Agent Account & Info -->
        <div class="row-container mb-3">
          <span class="text-[#6B7280] text-[11px] font-bold whitespace-nowrap">Agent account</span>
          <div class="flex items-center gap-1.5 text-[11px]">
             <div class="flex items-center gap-1">
                <ion-icon name="alarm" class="text-[#F1C15A] text-[13px]"></ion-icon>
                <span class="text-[#ADB6C3] font-black">{{ agentStats.account }}</span>
                <ion-icon name="information-circle-outline" class="text-[#F1C15A] text-[13px]"></ion-icon>
             </div>
             <div class="flex items-center gap-1">
                <span class="text-[#6B7280]">Agent mode</span>
                <span class="text-[#F1C15A] font-bold underline underline-offset-2 decoration-[#F1C15A]/40">Infinite range</span>
             </div>
          </div>
        </div>

        <!-- Row 2: Audits & Settlement -->
        <div class="stats-grid">
          <div class="flex flex-col gap-0.5">
            <span class="text-[#6B7280] text-[11px] font-bold">Number of audits</span>
            <span class="text-white text-[13px] font-black">{{ agentStats.auditNumber }}</span>
          </div>
          <div class="flex flex-col gap-0.5 sm:items-end">
            <span class="text-[#6B7280] text-[11px] font-bold">Settlement date</span>
            <span class="text-[#F1C15A] text-[13px] font-black stats-right-align">{{ agentStats.settlementDate }}</span>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .row-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .stats-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 10px;
      align-items: center;
    }

    .stats-right-align {
      text-align: right;
    }

    @media (max-width: 360px) {
      .row-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      
      .stats-grid {
        grid-template-cols: 1fr;
        gap: 8px;
      }
      
      .stats-right-align {
        text-align: left;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class InviteStatsComponent {
  @Input() agentStats!: AgentStats;
  @Input() inviteStats!: InviteStats;
}
