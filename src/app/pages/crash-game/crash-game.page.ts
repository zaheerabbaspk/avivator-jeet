import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, wallet, caretBack, arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline, removeCircleOutline, addCircleOutline, helpCircleOutline, menuOutline, homeOutline, notificationsOutline, remove, add, playBackOutline, play, checkmarkCircle, copyOutline, ellipsisHorizontal, person, shieldCheckmark, checkmarkSharp, volumeMediumOutline, volumeMuteOutline, musicalNotesOutline, flashOutline, starOutline, bookOutline, documentTextOutline, settingsOutline, closeOutline } from 'ionicons/icons';
import { CrashGameEngineService } from '../../services/crash-game-engine.service';
import { SoundService } from '../../services/sound.service';
import { DepositModalComponent } from '../../components/deposit-modal/deposit-modal.component';
import { BonusRainModalComponent } from '../../components/bonus-rain-modal/bonus-rain-modal.component';

// New Modular Components
import { AviatorHeaderComponent } from '../../components/crash/aviator-header/aviator-header.component';
import { AviatorHistoryComponent } from '../../components/crash/aviator-history/aviator-history.component';
import { AviatorGameScreenComponent } from '../../components/crash/aviator-game-screen/aviator-game-screen.component';
import { AviatorBetControlsComponent } from '../../components/crash/aviator-bet-controls/aviator-bet-controls.component';
import { AviatorSideNavComponent } from '../../components/crash/aviator-side-nav/aviator-side-nav.component';

@Component({
    selector: 'app-crash-game',
    templateUrl: './crash-game.page.html',
    styleUrls: ['./crash-game.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonContent,
        DepositModalComponent,
        BonusRainModalComponent,
        AviatorHeaderComponent,
        AviatorHistoryComponent,
        AviatorGameScreenComponent,
        AviatorBetControlsComponent,
        AviatorSideNavComponent,
        IonIcon
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

    // UI Overlays
    isSideNavOpen = false;
    isDepositModalOpen = false;
    isGameMenuOpen = false;
    isHistoryExpanded = false;
    isGameLimitsOpen = false;
    isBonusRainOpen = signal<boolean>(false);

    // Settings State
    settings: any = {
        sound: true,
        music: true,
        animation: true
    };

    // Empty bets array for UI (populates dynamically now)
    mockBets = signal<any[]>([]);

    // Slot A Signals
    betAmountA = signal<number>(16);
    autoCashoutA = signal<number>(2.0);
    useAutoCashoutA = signal<boolean>(false);
    useAutoBetA = signal<boolean>(false);
    slotAMode = signal<'manual' | 'auto'>('manual');

    // Slot B Signals
    betAmountB = signal<number>(16);
    autoCashoutB = signal<number>(2.0);
    useAutoCashoutB = signal<boolean>(false);
    useAutoBetB = signal<boolean>(false);
    slotBMode = signal<'manual' | 'auto'>('manual');
    
    // Dynamic Stats Signals
    totalBetsCount = signal<number>(0);
    totalActiveBets = signal<number>(0);
    totalWinAmount = signal<number>(0);

    // Realistic Base Offsets (Randomized on each round start)
    baseActivePlayers = signal<number>(0);
    baseBetsCount = signal<number>(0);


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
    private lastState: 'WAITING' | 'RUNNING' | 'CRASHED' | null = null;


    constructor() {
        addIcons({ home, wallet, caretBack, checkmarkSharp, helpCircleOutline, menuOutline, removeCircleOutline, addCircleOutline, arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline, homeOutline, notificationsOutline, remove, add, playBackOutline, play, checkmarkCircle, copyOutline, ellipsisHorizontal, person, shieldCheckmark, volumeMediumOutline, volumeMuteOutline, musicalNotesOutline, flashOutline, starOutline, bookOutline, documentTextOutline, settingsOutline, closeOutline });

        // Initial base numbers for realism
        this.baseActivePlayers.set(Math.floor(Math.random() * 2000) + 1000);
        this.baseBetsCount.set(Math.floor(Math.random() * 5000) + 3000);

        // Watch for game state changes from server
        effect(() => {
            const state = this.gameEngine.gameState();
            const multiplier = this.gameEngine.currentMultiplier();

            // Handle state transitions
            if (state === 'WAITING') {
                if (this.lastState !== 'WAITING') {
                    this.soundService.setFlight(false);
                    this.gameEngine.resetBetsIfNeeded();

                    this.animationStartTime = 0;
                    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
                    this.visualMultiplier.set(1.00);
                    
                    // Clear all bets (remove dummy users) ONLY when transition starts
                    this.mockBets.set([]);
                    this.totalBetsCount.set(0);
                    this.totalActiveBets.set(0);
                    this.totalWinAmount.set(0);

                    // Set new random base numbers for next round realism
                    this.baseActivePlayers.set(Math.floor(Math.random() * 500) + 200);
                    this.baseBetsCount.set(Math.floor(Math.random() * 1000) + 500);

                    // Start simulating random players joining
                    this.simulateRandomBets();
                }

                // Reactive Auto Bet Dependencies (read outside conditional to ensure tracking)
                const sAMode = this.slotAMode();
                const sBMode = this.slotBMode();
                const autoA = this.useAutoBetA();
                const autoB = this.useAutoBetB();

                // Auto Bet Logic
                if (sAMode === 'auto' && autoA && this.gameEngine.betSlotA().status === 'IDLE') {
                    this.internalPlaceBet('A');
                }
                if (sBMode === 'auto' && autoB && this.gameEngine.betSlotB().status === 'IDLE') {
                    this.internalPlaceBet('B');
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

                // Simulate mock players cashing out at various points
                this.simulateRandomWins();
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

                // Zero out active counts immediately on blast
                this.totalActiveBets.set(0);
                this.baseActivePlayers.set(0);
            }

            this.lastState = state;
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

    get planeTailCoordinates() {
        const { x, y, bobY } = this.planeCoordinates;
        const actualY = y + bobY;
        const tailX = x - 11.5;
        const tailY = (100 - actualY) + 4.5; // must match curvePath tailY exactly
        return { left: tailX, top: tailY };
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

    goBack() {
        this.soundService.stopAll();
        this.router.navigate(['/home'], { queryParams: { showBonus: 'true' } });
    }


    handlePlaceBet(slot: 'A' | 'B', event: { amount: number, autoCashout?: number | null }) {
        if (slot === 'A') {
            this.betAmountA.set(event.amount);
            this.useAutoCashoutA.set(!!event.autoCashout);
            if (event.autoCashout) this.autoCashoutA.set(event.autoCashout);
        } else {
            this.betAmountB.set(event.amount);
            this.useAutoCashoutB.set(!!event.autoCashout);
            if (event.autoCashout) this.autoCashoutB.set(event.autoCashout);
        }
        this.gameEngine.placeBet(slot, event.amount, event.autoCashout);

        // Dynamically add the user's bet to the All Bets list so it shows immediately
        const newBet = { 
            avatar: '5', // Mock user avatar
            name: 'YOU (Me)', // Show as current user
            bet: event.amount, 
            mult: null, 
            win: null 
        };
        this.mockBets.update(bets => [newBet, ...bets]);
        
        // Update Stats
        this.totalBetsCount.update(n => n + 1);
        this.totalActiveBets.update(n => n + 1);
    }

    private internalPlaceBet(slot: 'A' | 'B') {
        const amount = slot === 'A' ? this.betAmountA() : this.betAmountB();
        const auto = slot === 'A' 
            ? (this.useAutoCashoutA() ? this.autoCashoutA() : null)
            : (this.useAutoCashoutB() ? this.autoCashoutB() : null);
        this.gameEngine.placeBet(slot, amount, auto);
    }

    handleCashOut(slot: 'A' | 'B') {
        this.gameEngine.cashOut(slot);
        
        // Update the user's bet in the All Bets list to show as won
        const mult = this.gameEngine.currentMultiplier();
        this.mockBets.update(bets => {
            return bets.map(b => {
                if (b.name === 'YOU (Me)' && b.mult === null) {
                    const win = b.bet * mult;
                    // Update stats here too since we found the bet
                    this.totalWinAmount.update(w => w + win);
                    this.totalActiveBets.update(a => a - 1);
                    return { ...b, mult: mult.toFixed(2), win: win };
                }
                return b;
            });
        });
    }

    handleCancelBet(slot: 'A' | 'B') {
        this.gameEngine.cancelBet(slot);
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

    private simulateRandomBets() {
        // Add 15-30 random players over the next few seconds for a busy casino feel
        const count = Math.floor(Math.random() * 15) + 15;
        const possibleAmounts = [16, 32, 64, 100, 160, 320, 500, 1000, 1600, 3200, 5000];
        const names = [
            'a***1', '2***x', '9***q', 'P***r', 'K***0', '7***7', 'm***2', 's***9', 
            'f***z', 'u***6', 'v***1', 'r***k', 'L***v', 'x***x', 'b***8', 'n***n'
        ];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (this.gameEngine.gameState() !== 'WAITING') return;

                const amount = possibleAmounts[Math.floor(Math.random() * possibleAmounts.length)];
                const newBet = {
                    avatar: Math.floor(Math.random() * 70).toString(),
                    name: names[Math.floor(Math.random() * names.length)],
                    bet: amount,
                    mult: null,
                    win: null
                };

                this.mockBets.update(bets => [newBet, ...bets]);
                this.totalBetsCount.update(n => n + 1);
                this.totalActiveBets.update(n => n + 1);
            }, Math.random() * 4500); // Spread joining over the whole waiting period
        }
    }

    private lastWinSimTime = 0;
    private simulateRandomWins() {
        const now = Date.now();
        if (now - this.lastWinSimTime < 500) return; // Only check 2 times per second
        this.lastWinSimTime = now;

        const currentMult = this.gameEngine.currentMultiplier();
        if (currentMult < 1.1) return; 

        this.mockBets.update(bets => {
            return bets.map(b => {
                // If it's a mock player (not YOU) and hasn't won yet
                if (b.name !== 'YOU (Me)' && b.mult === null) {
                    // Very low chance per check to ensure many players lose
                    // Higher multiplier = much lower chance to win
                    const winChance = currentMult < 1.5 ? 0.05 : (currentMult < 2.5 ? 0.02 : 0.01);
                    
                    if (Math.random() < winChance) {
                        const win = b.bet * currentMult;
                        this.totalWinAmount.update(w => w + win);
                        this.totalActiveBets.update(a => a - 1);
                        return { ...b, mult: currentMult.toFixed(2), win: win };
                    }
                }
                return b;
            });
        });
    }
}

