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
        <div class="flex justify-between items-center mb-3">
          <span class="text-[#6B7280] text-[11px] font-bold">Agent account</span>
          <div class="flex items-center gap-1.5 text-[11px]">
             <ion-icon name="alarm" class="text-[#F1C15A] text-[13px]"></ion-icon>
             <span class="text-[#ADB6C3] font-black">{{ agentStats.account }}</span>
             <ion-icon name="information-circle-outline" class="text-[#F1C15A] text-[13px]"></ion-icon>
             <span class="text-[#6B7280] ml-1">Agent mode</span>
             <span class="text-[#F1C15A] font-bold underline underline-offset-2 decoration-[#F1C15A]/40">Infinite range</span>
          </div>
        </div>

        <!-- Row 2: Audits & Settlement -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-0.5">
            <span class="text-[#6B7280] text-[11px] font-bold">Number of audits</span>
            <span class="text-white text-[13px] font-black">{{ agentStats.auditNumber }}</span>
          </div>
          <div class="flex flex-col gap-0.5 min-w-[120px]">
            <span class="text-[#6B7280] text-[11px] font-bold">Settlement date</span>
            <span class="text-[#F1C15A] text-[13px] font-black">{{ agentStats.settlementDate }}</span>
          </div>
        </div>
        
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class InviteStatsComponent {
  @Input() agentStats!: AgentStats;
  @Input() inviteStats!: InviteStats;
}
