import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline, removeCircleOutline, addCircleOutline, helpCircleOutline, menuOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { CrashGameEngineService } from '../../services/crash-game-engine.service';

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
        IonIcon
    ]
})
export class CrashGamePage implements OnInit, OnDestroy {
    private router = inject(Router);
    gameEngine = inject(CrashGameEngineService);

    // Loading State
    isLoading = true;
    loadingProgress = 0;

    // UI Local State for Inputs
    betAmountA = 100;
    autoCashoutA: number | null = 2.0;
    useAutoCashoutA = false;

    betAmountB = 100;
    autoCashoutB: number | null = 2.0;
    useAutoCashoutB = false;

    constructor() {
        addIcons({ helpCircleOutline, menuOutline, removeCircleOutline, addCircleOutline, arrowBack, walletOutline, rocketOutline, listOutline, timeOutline, statsChartOutline, alertCircleOutline });

        // Watch for game state changes from server
        effect(() => {
            const state = this.gameEngine.gameState();
            console.log('Game state changed to:', state);

            // Handle state transitions
            if (state === 'WAITING') {
                this.gameEngine.resetBetsIfNeeded();
            } else if (state === 'CRASHED') {
                const crashMult = this.gameEngine.currentMultiplier();
                this.gameEngine.handleCrash(crashMult);
            }
        });
    }

    ngOnInit() {
        console.log('🎮 Crash game page initialized');
        console.log('🔌 Connection status:', this.gameEngine.connected());

        // Simulate real game loading sequence
        this.isLoading = true;
        this.loadingProgress = 0;
        const interval = setInterval(() => {
            this.loadingProgress += Math.floor(Math.random() * 20) + 10;
            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.isLoading = false;
                }, 400); // slight pause at 100% for realism
            }
        }, 150);
    }

    ngOnDestroy() {
        console.log('🎮 Crash game page destroyed');
    }

    // UI Actions (Refined for visible start)
    get planeCoordinates() {
        const m = this.gameEngine.currentMultiplier();
        const baseOffset = 2; // Keep a tiny offset for the plane image
        const x = baseOffset + Math.min(88, (m - 1) * 8);
        const y = baseOffset + Math.min(78, Math.pow(m - 1, 0.8) * 12);
        return { x, y, baseOffset };
    }

    get planePosition() {
        const { x, y } = this.planeCoordinates;
        const baseOffset = 2;
        return {
            left: `${x}%`,
            bottom: `${y}%`,
            transform: `translate(-50%, 50%) rotate(${-Math.atan2(y - baseOffset, x - baseOffset) * (180 / Math.PI) * 0.2}deg)`
        };
    }

    get curvePath() {
        const { x, y } = this.planeCoordinates;
        // Graph starts from the absolute corner (0, 100)
        return `M 0 100 Q ${x * 0.5} 100, ${x} ${100 - y}`;
    }

    adjustBet(slot: 'A' | 'B', amount: number, mode: 'set' | 'add') {
        if (slot === 'A') {
            this.betAmountA = mode === 'set' ? amount : this.betAmountA + amount;
            if (this.betAmountA < 0) this.betAmountA = 0;
        } else {
            this.betAmountB = mode === 'set' ? amount : this.betAmountB + amount;
            if (this.betAmountB < 0) this.betAmountB = 0;
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
        if (m <= 2) return 'bg-gray-500';
        if (m <= 10) return 'bg-blue-600';
        return 'bg-purple-600';
    }
}
