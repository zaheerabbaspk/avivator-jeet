import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, wallet, caretBack, arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline, removeCircleOutline, addCircleOutline, helpCircleOutline, menuOutline, homeOutline, notificationsOutline, remove, add, playBackOutline, play, checkmarkCircle, copyOutline, ellipsisHorizontal, person, shieldCheckmark, checkmarkSharp } from 'ionicons/icons';
import { Router } from '@angular/router';
import { CrashGameEngineService } from '../../services/crash-game-engine.service';
import { DepositModalComponent } from '../../components/deposit-modal/deposit-modal.component';

@Component({
    selector: 'app-crash-game',
    templateUrl: './crash-game.page.html',
    styleUrls: ['./crash-game.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButton,
        IonIcon,
        DepositModalComponent
    ]
})
export class CrashGamePage implements OnInit, OnDestroy {
    private router = inject(Router);
    gameEngine = inject(CrashGameEngineService);

    // Loading State
    isLoading = true;
    loadingProgress = 0;

    // UI Local State for Inputs
    isSideNavOpen = false;
    isDepositModalOpen = false;
    betAmountA = 1;
    autoCashoutA: number | null = 2.0;
    useAutoCashoutA = false;

    betAmountB = 1;
    autoCashoutB: number | null = 2.0;
    useAutoCashoutB = false;

    // Tab mode: 'manual' | 'auto'
    slotAMode: 'manual' | 'auto' = 'manual';
    slotBMode: 'manual' | 'auto' = 'manual';

    // Side Nav Drag State
    sideNavTopPx = 80;
    private isDraggingNav = false;
    private touchStartY = 0;
    private initialTop = 0;
    private draggedDistance = 0;

    startDrag(event: TouchEvent | MouseEvent) {
        this.isDraggingNav = true;
        this.draggedDistance = 0;
        this.touchStartY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        this.initialTop = this.sideNavTopPx;
    }

    doDrag(event: TouchEvent | MouseEvent) {
        if (!this.isDraggingNav) return;
        
        const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        const deltaY = currentY - this.touchStartY;
        this.draggedDistance = Math.abs(deltaY);

        if (this.draggedDistance > 5) {
            // Check if cancelable before calling preventDefault to avoid passive listener console errors
            if (event.cancelable) {
                event.preventDefault(); 
            }
        }

        let newTop = this.initialTop + deltaY;
        
        // Clamp top bounds (so user doesn't drag it out of the game view)
        if (newTop < 10) newTop = 10;
        if (newTop > 200) newTop = 200; 
        
        this.sideNavTopPx = newTop;
    }

    endDrag() {
        this.isDraggingNav = false;
    }

    toggleSideNav(forceOpen?: boolean) {
        if (this.draggedDistance < 5) {
            if (forceOpen !== undefined) {
                this.isSideNavOpen = forceOpen;
            } else {
                this.isSideNavOpen = !this.isSideNavOpen;
            }
        }
        this.isDraggingNav = false;
    }

    // Audio State
    private audioCtx: AudioContext | null = null;
    private engineOsc: OscillatorNode | null = null;
    private engineGain: GainNode | null = null;

    constructor() {
        addIcons({ home, wallet, caretBack, checkmarkSharp, helpCircleOutline, menuOutline, removeCircleOutline, addCircleOutline, arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline, homeOutline, notificationsOutline, remove, add, playBackOutline, play, checkmarkCircle, copyOutline, ellipsisHorizontal, person, shieldCheckmark });

        // Watch for game state changes from server
        effect(() => {
            const state = this.gameEngine.gameState();
            
            // Handle state transitions
            if (state === 'WAITING') {
                this.stopEngineSound();
                this.gameEngine.resetBetsIfNeeded();
            } else if (state === 'RUNNING') {
                // ONLY play sound if game is not in loading screen
                if (!this.isLoading) {
                    this.playEngineSound();
                }
            } else if (state === 'CRASHED') {
                this.stopEngineSound();
                if (!this.isLoading) {
                    this.playBlastSound();
                }
                const crashMult = this.gameEngine.currentMultiplier();
                this.gameEngine.handleCrash(crashMult);
            }
        });
    }

    // --- Audio Synthesis Engine ---
    private initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    private playEngineSound() {
        this.initAudio();
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        this.stopEngineSound();

        // Create engine drone (propeller plane rumble)
        this.engineOsc = this.audioCtx.createOscillator();
        this.engineGain = this.audioCtx.createGain();
        
        this.engineOsc.type = 'sawtooth';
        this.engineOsc.frequency.setValueAtTime(45, this.audioCtx.currentTime); 
        this.engineOsc.frequency.exponentialRampToValueAtTime(140, this.audioCtx.currentTime + 25);
        
        this.engineGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        this.engineGain.gain.linearRampToValueAtTime(0.06, this.audioCtx.currentTime + 1);

        this.engineOsc.connect(this.engineGain);
        this.engineGain.connect(this.audioCtx.destination);
        
        this.engineOsc.start();
    }

    private stopEngineSound() {
        if (this.engineOsc && this.engineGain && this.audioCtx) {
            this.engineGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
            this.engineGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.3);
            setTimeout(() => {
                try { this.engineOsc?.stop(); } catch(e){}
                this.engineOsc = null;
            }, 300);
        }
    }

    private playBlastSound() {
        this.initAudio();
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        // White noise explosion blast
        const bufferSize = this.audioCtx.sampleRate * 1.5;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.8; 
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        // Thud filter
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, this.audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 1.2);

        const gainNode = this.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.2);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        noise.start();
    }

    ngOnInit() {
        console.log('🎮 Crash game page initialized');
        
        // --- Cinematic Loading Sequence (Spribe Logic) ---
        this.isLoading = true;
        this.loadingProgress = 0;

        const startLoading = () => {
            let current = 0;
            const tick = () => {
                let push = Math.random() * 3;
                
                // Simulate various loading phases
                if (current < 15) push = Math.random() * 8; // Fast initial handshake
                else if (current > 40 && current < 55) push = Math.random() * 0.4; // Simulate "Establishing Secure Socket"
                else if (current > 88 && current < 94) push = 0.08; // Simulate "Finalizing Player Sync"
                else if (current > 94) push = Math.random() * 10; // Burst to 100
                
                current += push;
                
                if (current >= 100) {
                    this.loadingProgress = 100;
                    setTimeout(() => {
                        this.isLoading = false;
                        // Trigger sound if game is already running after loading completes
                        if (this.gameEngine.gameState() === 'RUNNING') {
                            this.playEngineSound();
                        }
                    }, 600);
                    return;
                }
                
                this.loadingProgress = current;
                setTimeout(tick, Math.random() * 80 + 30);
            };
            tick();
        };

        startLoading();
    }

    ngOnDestroy() {
        console.log('🎮 Crash game page destroyed');
        this.stopEngineSound(); // Ensure sound stops on back
    }

    // UI Actions (Refined for visible start)
    get planeCoordinates() {
        const m = this.gameEngine.currentMultiplier();
        const baseOffset = 2; 
        // Plane moves right but caps earlier (75 instead of 88) 
        // so the 80px plane image doesn't go "inside" or get cut off by the right edge.
        const x = baseOffset + Math.min(75, Math.pow(m - 1, 0.5) * 35);
        const y = baseOffset + Math.min(85, Math.pow(m - 1, 0.6) * 38);
        return { x, y, baseOffset };
    }

    get planePosition() {
        const state = this.gameEngine.gameState();

        if (state === 'CRASHED') {
            return {
                left: `150%`,
                bottom: `150%`,
                transform: `translate(-50%, 50%) rotate(-45deg)`,
                transition: 'left 0.7s cubic-bezier(0.4, 0, 1, 1), bottom 0.7s cubic-bezier(0.4, 0, 1, 1), transform 0.4s ease-in',
                opacity: '1'
            };
        }

        const { x, y } = this.planeCoordinates;
        const baseOffset = 2;
        return {
            left: `${x}%`,
            bottom: `${y}%`,
            transform: `translate(-50%, 50%) rotate(${-Math.atan2(y - baseOffset, x - baseOffset) * (180 / Math.PI) * 0.2}deg)`,
            transition: state === 'WAITING' ? 'none' : 'left 0.1s linear, bottom 0.1s linear, transform 0.1s linear',
            opacity: state === 'WAITING' ? '0' : '1'
        };
    }

    get curvePath() {
        const { x, y } = this.planeCoordinates;
        // Graph starts from the absolute corner (0, 100)
        return `M 0 100 Q ${x * 0.5} 100, ${x} ${100 - y}`;
    }

    adjustBet(slot: 'A' | 'B', inputValue: number, mode: 'set' | 'add') {
        if (slot === 'A') {
            if (mode === 'set') {
                // Quick buttons are additive "Chips" logic
                this.betAmountA += inputValue;
            } else {
                // Simple linear counting (1, 2, 3, 4, 5...)
                this.betAmountA += inputValue; 
            }
            if (this.betAmountA < 1) this.betAmountA = 1;
        } else {
            if (mode === 'set') {
                // Quick buttons are additive "Chips" logic
                this.betAmountB += inputValue;
            } else {
                // Simple linear counting (1, 2, 3, 4, 5...)
                this.betAmountB += inputValue;
            }
            if (this.betAmountB < 1) this.betAmountB = 1;
        }
    }

    placeBet(slot: 'A' | 'B') {
        const amount = slot === 'A' ? this.betAmountA : this.betAmountB;
        const auto = slot === 'A'
            ? (this.useAutoCashoutA ? this.autoCashoutA : null)
            : (this.useAutoCashoutB ? this.autoCashoutB : null);

        this.gameEngine.placeBet(slot, amount, auto);
    }

    cashOut(slot: 'A' | 'B') {
        this.gameEngine.cashOut(slot);
    }

    goBack() {
        this.router.navigate(['/home'], { queryParams: { showReward: 'true' } });
    }

    // Formatting helpers
    getMultiplierColor(m: number): string {
        if (m < 2) return 'text-[#28a9ea]';
        return 'text-[#b722c1]';
    }
}
