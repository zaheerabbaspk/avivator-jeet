export type RoundState = 'BETTING' | 'RUNNING' | 'CRASHED';

export interface Bet {
    id: string;
    slot: 'A' | 'B';
    amount: number;
    status: 'IDLE' | 'PLACED' | 'CASHED_OUT' | 'LOST';
    autoCashout?: number | null;
    cashoutMultiplier?: number;
    payout?: number;
}

export interface RoundResult {
    id: string;
    nonce: number;
    crashMultiplier: number;
    startTime: number;
    endTime: number;
    serverSeed: string;
    clientSeed: string;
    hash: string;
}

export interface MockPlayer {
    id: string;
    name: string;
    avatar: string;
    betAmount: number;
    cashoutAt?: number;
    multiplier?: number;
    isCashedOut: boolean;
    isLost: boolean;
}

export interface GameState {
    state: RoundState;
    currentMultiplier: number;
    crashMultiplier: number;
    timeLeft: number;
    nonce: number;
    history: number[];
    players: MockPlayer[];
}
