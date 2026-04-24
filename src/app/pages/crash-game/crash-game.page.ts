import { Component, inject, OnInit, OnDestroy, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, wallet, caretBack, arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline, removeCircleOutline, addCircleOutline, helpCircleOutline, menuOutline, homeOutline, notificationsOutline, remove, add, playBackOutline, play, checkmarkCircle, copyOutline, ellipsisHorizontal, person, shieldCheckmark, checkmarkSharp, volumeMediumOutline, volumeMuteOutline, musicalNotesOutline, flashOutline, starOutline, bookOutline, documentTextOutline, settingsOutline, closeOutline } from 'ionicons/icons';
import { Router, ActivatedRoute } from '@angular/router';
import { CrashGameEngineService } from '../../services/crash-game-engine.service';
import { SoundService } from '../../services/sound.service';
import { DepositModalComponent } from '../../components/deposit-modal/deposit-modal.component';
import { BonusRainModalComponent } from '../../components/bonus-rain-modal/bonus-rain-modal.component';

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
        DepositModalComponent,
        BonusRainModalComponent
    ]
})
export class CrashGamePage implements OnInit, OnDestroy {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private soundService = inject(SoundService);
    gameEngine = inject(CrashGameEngineService);

    // Loading State
    isLoading = true;
    loadingPhase: 'splash' | 'connection' | 'loading' = 'splash';
    loadingProgress = 0;
    loadingImage = 'https://140.150.30.128:5030/siteadmin/skin/lobby_asset/common/web/animated/apng_loading_game.avif';

    // ... (rest of signal/state declarations) ...
    isSideNavOpen = false;
    isDepositModalOpen = false;
    isGameMenuOpen = false;
    isHistoryExpanded = false;
    isGameLimitsOpen = false;
    isBonusRainOpen = signal<boolean>(false);

    // Settings State
    settings = {
        sound: true,
        music: true,
        animation: true
    };

    betAmountA = 16;

    // Slot A Signals
    autoCashoutA = signal<number>(2.0);
    useAutoCashoutA = signal<boolean>(false);
    useAutoBetA = signal<boolean>(false);
    slotAMode = signal<'manual' | 'auto'>('manual');

    betAmountB = 16;

    // Slot B Signals
    autoCashoutB = signal<number>(2.0);
    useAutoCashoutB = signal<boolean>(false);
    useAutoBetB = signal<boolean>(false);
    slotBMode = signal<'manual' | 'auto'>('manual');

    // Side Nav Drag State
    sideNavTopPx = 80;
    private isDraggingNav = false;
    private touchStartY = 0;
    private initialTop = 0;
    private draggedDistance = 0;

    // Smooth Animation State
    private animationFrameId?: number;
    private animationStartTime = 0;
    visualMultiplier = signal<number>(1.00);

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

    constructor() {
        addIcons({ home, wallet, caretBack, checkmarkSharp, helpCircleOutline, menuOutline, removeCircleOutline, addCircleOutline, arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline, homeOutline, notificationsOutline, remove, add, playBackOutline, play, checkmarkCircle, copyOutline, ellipsisHorizontal, person, shieldCheckmark, volumeMediumOutline, volumeMuteOutline, musicalNotesOutline, flashOutline, starOutline, bookOutline, documentTextOutline, settingsOutline, closeOutline });

        // Watch for game state changes from server
        effect(() => {
            const state = this.gameEngine.gameState();
            const multiplier = this.gameEngine.currentMultiplier();

            // Reactive Auto Bet Dependencies
            const sAMode = this.slotAMode();
            const sBMode = this.slotBMode();
            const autoA = this.useAutoBetA();
            const autoB = this.useAutoBetB();

            // Handle state transitions
            if (state === 'WAITING') {
                this.soundService.setFlight(false);
                this.gameEngine.resetBetsIfNeeded();

                this.animationStartTime = 0;
                if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
                this.visualMultiplier.set(1.00);

                // Auto Bet Logic
                if (sAMode === 'auto' && autoA && this.gameEngine.betSlotA().status === 'IDLE') {
                    this.placeBet('A');
                }
                if (sBMode === 'auto' && autoB && this.gameEngine.betSlotB().status === 'IDLE') {
                    this.placeBet('B');
                }
            } else if (state === 'RUNNING') {
                // ONLY play sound if game is not in loading screen
                if (!this.isLoading) {
                    this.soundService.setFlight(true, multiplier);
                }

                // Start smooth local animation
                if (this.animationStartTime === 0) {
                    this.animationStartTime = Date.now();
                    this.animatePlane();
                }
            } else if (state === 'CRASHED') {
                this.soundService.setFlight(false);
                if (!this.isLoading) {
                    this.soundService.playFlyAway();
                }

                this.animationStartTime = 0;
                if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

                const crashMult = this.gameEngine.currentMultiplier();
                this.visualMultiplier.set(crashMult); // Snap to exact crash number
                this.gameEngine.handleCrash(crashMult);
            }
        }, { allowSignalWrites: true });
    }

    animatePlane() {
        if (this.gameEngine.gameState() !== 'RUNNING') {
            this.animationStartTime = 0;
            return;
        }

        // Strictly bind the visual text and plane to the live server multiplier.
        // This guarantees the screen will NEVER show a different number than the true blast result.
        this.visualMultiplier.set(this.gameEngine.currentMultiplier());

        this.animationFrameId = requestAnimationFrame(() => this.animatePlane());
    }

    ngOnInit() {
        console.log('🎮 Crash game page initialized');

        // Check for bonus rain trigger from URL
        this.route.queryParams.subscribe(params => {
            if (params['showBonus'] === 'true') {
                this.isBonusRainOpen.set(true);
            }
        });

        // --- Multi-Phase Loading Sequence ---
        this.isLoading = true;
        this.loadingPhase = 'loading'; // Phase 1: Animated Loading first
        this.loadingProgress = 0;

        const startLoading = () => {
            // Start the ticker for Phase 1
            this.runProgressTicker((completed) => {
                if (completed) {
                    // Phase 2: Powered by Spribe
                    this.loadingPhase = 'splash';
                    
                    setTimeout(() => {
                        // Phase 3: Connection...
                        this.loadingPhase = 'connection';

                        setTimeout(() => {
                            this.isLoading = false;
                            if (this.gameEngine.gameState() === 'RUNNING') {
                                this.soundService.setFlight(true, this.gameEngine.currentMultiplier());
                            }
                        }, 2000); // Increased connection delay from 1500ms

                    }, 3500); // Increased Spribe delay from 2500ms
                }
            });
        };

        startLoading();
    }

    private runProgressTicker(callback?: (done: boolean) => void) {
        let current = 0;
        const tick = () => {
            let push = Math.random() * 8.5; // Keep this fast as requested

            if (current < 20) push = Math.random() * 12; 
            else if (current > 88 && current < 94) push = 0.15; 
            else if (current > 94) push = Math.random() * 20;

            current += push;

            if (current >= 100) {
                this.loadingProgress = 100;
                if (callback) callback(true);
                return;
            }

            this.loadingProgress = current;
            setTimeout(tick, Math.random() * 40 + 10);
        };
        tick();
    }

    toggleGameMenu() {
        this.isGameMenuOpen = !this.isGameMenuOpen;
    }

    toggleHistoryExpanded() {
        this.isHistoryExpanded = !this.isHistoryExpanded;
    }

    toggleGameLimits() {
        this.isGameLimitsOpen = !this.isGameLimitsOpen;
        if (this.isGameLimitsOpen) {
            this.isGameMenuOpen = false; // Close menu when opening limits
        }
    }

    toggleSetting(key: 'sound' | 'music' | 'animation') {
        this.settings[key] = !this.settings[key];
        if (key === 'sound') {
            this.soundService.toggleMute();
        }
    }


    ngOnDestroy() {
        console.log('🎮 Crash game page destroyed');
        this.soundService.stopAll(); // Ensure sound stops on back
    }

    // UI Actions (Refined for realistic flight)
    private peakReachedTime: number | null = null;

    get planeCoordinates() {
        const state = this.gameEngine.gameState();
        if (state === 'WAITING') {
            this.peakReachedTime = null; // Reset for next round
            return { x: 14, y: 10, bobY: 0, bobRot: 0, baseOffset: 10 };
        }

        const m = this.visualMultiplier();

        // TAKE-OFF LOGIC: 
        // 1.00 - 1.10: Runway roll (mostly horizontal)
        // 1.10 - 1.55: Lift off to peak height

        let targetX = 14;
        let targetY = 10;

        if (m < 1.10) {
            // Horizontal roll
            const rollProgress = (m - 1) / 0.10;
            targetX = 14 + (rollProgress * 8); // Move right to 22%
            targetY = 10;
        } else {
            // Actual flight rise (reach peak by 1.55x)
            const flightProgress = Math.min((m - 1.10) / 0.45, 1);
            const ease = Math.pow(flightProgress, 1.3); // Slightly faster curve

            // Move higher (92%) and further right (70%) as requested
            targetX = 22 + (ease * 48);
            targetY = 10 + (ease * 82);
        }

        let bobX = 0;
        let bobY = 0;
        let bobRot = 0;

        if (m >= 1.55) {
            if (!this.peakReachedTime) this.peakReachedTime = Date.now();

            // Calculate time since peak was reached
            const elapsed = (Date.now() - this.peakReachedTime) / 1000;

            // Wait 1 second at peak for the first time
            if (elapsed > 1.0) {
                const dipTime = (elapsed - 1.0) * 0.8; // Smooth speed
                // This formula creates a smooth 0 -> 1 -> 0 loop that sits at 0 (the peak) naturally
                const dip = (1 - Math.cos(dipTime)) / 2;

                bobY = -dip * 18; // 18% vertical dip
                bobX = dip * 10;  // 10% horizontal drift
                bobRot = dip * -1.5;
            }

        }

        return {
            x: targetX + bobX,
            y: targetY + bobY,
            bobY: 0,
            bobRot: bobRot,
            baseOffset: 10
        };
    }

    get planePosition() {
        const state = this.gameEngine.gameState();

        if (state === 'CRASHED') {
            return {
                left: `150%`,
                bottom: `150%`,
                transform: `translate(-50%, 50%) rotate(0deg)`,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 1, 1)',
                opacity: '1'
            };
        }

        const { x, y, bobY, bobRot } = this.planeCoordinates;
        const actualY = y + bobY;

        // Plane stays perfectly straight (0 deg) as requested
        const flightAngle = 0;

        return {
            left: `${x}%`,
            bottom: `${actualY}%`,
            transform: `translate(-50%, 50%) rotate(${flightAngle + bobRot}deg)`,
            transition: 'none',
            opacity: '1'
        };
    }

    get curvePath() {
        const { x, y, bobY } = this.planeCoordinates;
        const actualY = y + bobY;

        // Tail connection point
        const tailX = x - 11.5;
        const tailY = (100 - actualY) + 4.5;

        // Quadratic curve: Control point at (tailX * 0.5, 100) - 
        // using 0.5 instead of 0.85 makes it curve up sooner, matching the "diagonal beam" look
        return `M 0 100 Q ${tailX * 0.5} 100, ${tailX} ${tailY}`;
    }

    private lastClickedValueA: number | null = null;
    private lastClickedValueB: number | null = null;

    adjustBet(slot: 'A' | 'B', inputValue: number, mode: 'set' | 'add') {
        const step = 16;
        if (slot === 'A') {
            if (mode === 'set') {
                // Hybrid Logic: If clicking the same button again, ADD it. If a different button, SET it.
                if (this.lastClickedValueA === inputValue) {
                    this.betAmountA += inputValue;
                } else {
                    this.betAmountA = inputValue;
                }
                this.lastClickedValueA = inputValue;
            } else {
                // Plus/Minus buttons step by 16
                this.betAmountA += (inputValue > 0 ? step : -step);
                this.lastClickedValueA = null; // Reset hybrid tracking on manual adjustment
            }
            if (this.betAmountA < 16) this.betAmountA = 16;
        } else {
            if (mode === 'set') {
                // Hybrid Logic: If clicking the same button again, ADD it. If a different button, SET it.
                if (this.lastClickedValueB === inputValue) {
                    this.betAmountB += inputValue;
                } else {
                    this.betAmountB = inputValue;
                }
                this.lastClickedValueB = inputValue;
            } else {
                // Plus/Minus buttons step by 16
                this.betAmountB += (inputValue > 0 ? step : -step);
                this.lastClickedValueB = null; // Reset hybrid tracking on manual adjustment
            }
            if (this.betAmountB < 16) this.betAmountB = 16;
        }
    }

    placeBet(slot: 'A' | 'B') {
        let amount = slot === 'A' ? this.betAmountA : this.betAmountB;

        // Final safety check to enforce minimum bet
        if (amount < 16) {
            amount = 16;
            if (slot === 'A') this.betAmountA = 16;
            else this.betAmountB = 16;
        }

        const auto = slot === 'A'
            ? (this.useAutoCashoutA() ? this.autoCashoutA() : null)
            : (this.useAutoCashoutB() ? this.autoCashoutB() : null);

        this.gameEngine.placeBet(slot, amount, auto);
    }


    cashOut(slot: 'A' | 'B') {
        this.gameEngine.cashOut(slot);
    }

    cancelBet(slot: 'A' | 'B') {
        this.gameEngine.cancelBet(slot);
    }

    goBack() {
        this.soundService.stopAll();
        this.router.navigate(['/home'], { queryParams: { showBonus: 'true' } });
    }

    // Formatting helpers
    getMultiplierColor(m: number): string {
        if (m < 2) return 'text-[#28a9ea]';
        return 'text-[#b722c1]';
    }

    getExpandedHistoryBg(m: number): string {
        if (m < 2) return 'bg-[#151b22]'; // Subtle blue tint for low
        return 'bg-[#201522]'; // Subtle pink tint for high
    }
}
