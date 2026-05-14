
export type Rank = 'K' | 'Q' | 'J' | '11' | '10' | '9' | '8' | '7' | '6';

export interface CompareResult {
    winnerId: string | 'TIE';
    winnerValue: number | null;
    reason: string;
}

export interface ConditionResult {
    conditionSide: 'TOP' | 'BOTTOM' | 'TIE';
    top: CompareResult;
    bottom: CompareResult;
    conditionWinnerId: string | 'TIE';
    tieBreak?: {
        handAId: string;
        handBId: string;
        handAScore: number;
        handBScore: number;
        winnerId: string | 'TIE';
    };
    reason: string;
}

// 1) Numeric Mapping (MUST be used everywhere)
export const SCORE_MAP: Record<string, number> = {
    'K': 13,
    'Q': 12,
    'J': 11,
    '11': 11,
    '10': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6
};

/**
 * 2) Create normalizeRank(rank: string | number)
 * Accept "K", "Q", "J", "11", 11, 10, 9, 8, 7
 * Convert to Normalized String Key for Map lookup
 */
export function normalizeRank(rank: string | number): string {
    const r = String(rank).toUpperCase();
    if (SCORE_MAP[r] === undefined) {
        throw new Error(`Invalid rank: ${rank}. Allowed: K, Q, J, 11, 10, 9, 8, 7`);
    }
    return r;
}

export function rankToScore(rank: string | number): number {
    return SCORE_MAP[normalizeRank(rank)];
}

/**
 * 3) Create compareCards(aRank, bRank, aId, bId)
 * Return: { winnerId: aId | bId | "TIE", winnerValue: number | null, reason: string }
 */
export function compareCards(
    aRank: string | number,
    bRank: string | number,
    aId: string,
    bId: string
): CompareResult {
    const scoreA = rankToScore(aRank);
    const scoreB = rankToScore(bRank);
    const normA = normalizeRank(aRank);
    const normB = normalizeRank(bRank);

    if (scoreA > scoreB) {
        return {
            winnerId: aId,
            winnerValue: scoreA,
            reason: `${aId}(${normA}=${scoreA}) > ${bId}(${normB}=${scoreB})`
        };
    } else if (scoreB > scoreA) {
        return {
            winnerId: bId,
            winnerValue: scoreB,
            reason: `${bId}(${normB}=${scoreB}) > ${aId}(${normA}=${scoreA})`
        };
    } else {
        return {
            winnerId: 'TIE',
            winnerValue: scoreA, // Tie Value is the score
            reason: `${aId}(${normA}=${scoreA}) == ${bId}(${normB}=${scoreB})`
        };
    }
}

// Alias for compatibility if existing code uses comparePair
export const comparePair = compareCards;


/**
 * 4) Helper: Pick Top 2 Hands for Tie Break
 * Returns IDs of the two hands with highest base scores.
 */
function pickTopTwoHands(hands: { id: string, rank: string | number }[]) {
    // Sort descending by score
    const sorted = [...hands].sort((a, b) => rankToScore(b.rank) - rankToScore(a.rank));
    // If multiple max scores equal, stable sort preserves original order somewhat, 
    // but JS sort isn't guaranteed stable across all browsers historically (though modern is).
    // To be deterministic tie-breaker: if score equal, pick lower ID index (hand1 < hand2 etc)
    // Actually simplicity first: just pick top 2.
    return [sorted[0].id, sorted[1].id];
}

/**
 * 5) Main Logic: Decide Condition & Final Result
 */
export function decideFinalResult(inputs: {
    hand1: { rank: string | number, extraRank?: string | number },
    hand2: { rank: string | number, extraRank?: string | number },
    hand3: { rank: string | number, extraRank?: string | number },
    hand4: { rank: string | number, extraRank?: string | number }
}): ConditionResult {
    const h1 = inputs.hand1;
    const h2 = inputs.hand2;
    const h3 = inputs.hand3;
    const h4 = inputs.hand4;

    // 1. Primary Condition Matches
    const topResult = compareCards(h1.rank, h2.rank, 'hand1', 'hand2');
    const bottomResult = compareCards(h3.rank, h4.rank, 'hand3', 'hand4');

    // Values for condition comparison
    const topScore = topResult.winnerValue || 0;
    const bottomScore = bottomResult.winnerValue || 0;

    let conditionSide: 'TOP' | 'BOTTOM' | 'TIE';
    let conditionWinnerId: string | 'TIE';
    let reason = '';

    // Helper for forcing Tie Break on specitic pair (Side Tie)
    const resolveSpecificTie = (idA: string, idB: string, rankA: any, rankB: any) => {
        const handA = (inputs as any)[idA];
        const handB = (inputs as any)[idB];
        const scoreA = rankToScore(handA.rank) + (handA.extraRank ? rankToScore(handA.extraRank) : 0);
        const scoreB = rankToScore(handB.rank) + (handB.extraRank ? rankToScore(handB.extraRank) : 0);

        let wId: string | 'TIE' = 'TIE';
        if (scoreA > scoreB) wId = idA;
        else if (scoreB > scoreA) wId = idB;
        else {
            // Tie on total -> Max single card check
            const maxA = Math.max(rankToScore(handA.rank), handA.extraRank ? rankToScore(handA.extraRank) : 0);
            const maxB = Math.max(rankToScore(handB.rank), handB.extraRank ? rankToScore(handB.extraRank) : 0);
            if (maxA > maxB) wId = idA;
            else if (maxB > maxA) wId = idB;
        }
        return { wId, scoreA, scoreB };
    };

    if (topScore > bottomScore) {
        if (topResult.winnerId === 'TIE') {
            // Top Pair Won by Score (e.g. K-K=13 vs J-8=11), but Top is a Pair. Break Tie.
            conditionSide = 'TIE';
            const { wId, scoreA, scoreB } = resolveSpecificTie('hand1', 'hand2', h1.rank, h2.rank);
            return {
                conditionSide: 'TIE',
                top: topResult,
                bottom: bottomResult,
                conditionWinnerId: wId,
                tieBreak: {
                    handAId: 'hand1',
                    handBId: 'hand2',
                    handAScore: scoreA,
                    handBScore: scoreB,
                    winnerId: wId
                },
                reason: `TOP Pair Win (Tie Break H1/H2)`
            };
        } else {
            conditionSide = 'TOP';
            conditionWinnerId = topResult.winnerId;
            reason = `TOP wins: [${topScore} vs ${bottomScore}]`;
            return { conditionSide, top: topResult, bottom: bottomResult, conditionWinnerId, reason };
        }
    }
    else if (bottomScore > topScore) {
        if (bottomResult.winnerId === 'TIE') {
            // Bottom Pair Won by Score. Break Tie.
            conditionSide = 'TIE';
            const { wId, scoreA, scoreB } = resolveSpecificTie('hand3', 'hand4', h3.rank, h4.rank);
            return {
                conditionSide: 'TIE',
                top: topResult,
                bottom: bottomResult,
                conditionWinnerId: wId,
                tieBreak: {
                    handAId: 'hand3',
                    handBId: 'hand4',
                    handAScore: scoreA,
                    handBScore: scoreB,
                    winnerId: wId
                },
                reason: `BOTTOM Pair Win (Tie Break H3/H4)`
            };
        } else {
            conditionSide = 'BOTTOM';
            conditionWinnerId = bottomResult.winnerId;
            reason = `BOTTOM wins: [${bottomScore} vs ${topScore}]`;
            return { conditionSide, top: topResult, bottom: bottomResult, conditionWinnerId, reason };
        }
    }
    else {
        // GLOBAL TIE (Scores Equal e.g. 10 vs 10, or K-K vs K-K)
        conditionSide = 'TIE';

        // Pick Top 2 Hands from all 4 base hands
        const allHands = [
            { id: 'hand1', rank: h1.rank },
            { id: 'hand2', rank: h2.rank },
            { id: 'hand3', rank: h3.rank },
            { id: 'hand4', rank: h4.rank }
        ];
        const [idA, idB] = pickTopTwoHands(allHands);

        const handA = (inputs as any)[idA];
        const handB = (inputs as any)[idB];

        const scoreA = rankToScore(handA.rank) + (handA.extraRank ? rankToScore(handA.extraRank) : 0);
        const scoreB = rankToScore(handB.rank) + (handB.extraRank ? rankToScore(handB.extraRank) : 0);

        let tieWinnerId: string | 'TIE' = 'TIE';
        if (scoreA > scoreB) tieWinnerId = idA;
        else if (scoreB > scoreA) tieWinnerId = idB;
        else {
            const maxA = Math.max(rankToScore(handA.rank), handA.extraRank ? rankToScore(handA.extraRank) : 0);
            const maxB = Math.max(rankToScore(handB.rank), handB.extraRank ? rankToScore(handB.extraRank) : 0);

            if (maxA > maxB) tieWinnerId = idA;
            else if (maxB > maxA) tieWinnerId = idB;
            else tieWinnerId = 'TIE';
        }

        return {
            conditionSide: 'TIE',
            top: topResult,
            bottom: bottomResult,
            conditionWinnerId: tieWinnerId,
            tieBreak: {
                handAId: idA,
                handBId: idB,
                handAScore: scoreA,
                handBScore: scoreB,
                winnerId: tieWinnerId
            },
            reason: `GLOBAL TIE Break between ${idA} & ${idB}. Winner: ${tieWinnerId}`
        };
    }
}

export const decideCondition = decideFinalResult;


// --- Test Cases ---
export function runConditionTests() {
    console.log("--- Running Casino Condition Tests (Standard Values) ---");

    // Case 1: K(13) vs 10(10)
    console.log("Test 1 (K vs 10):", compareCards('K', '10', 'h1', 'h2'));
    // Expect: winnerId: h1, value: 13, reason: h1(K=13) > h2(10=10)

    // Case 2: Q(12) vs J(11)
    console.log("Test 2 (Q vs J):", compareCards('Q', 'J', 'h1', 'h2'));
    // Expect: winnerId: h1, value: 12

    // Case 3: J(11) vs 11(11) -> TIE
    console.log("Test 3 (J vs 11):", compareCards('J', '11', 'h1', 'h2'));
    // Expect: winnerId: TIE, value: 11

    // Case 4: 9 vs 8
    console.log("Test 4 (9 vs 8):", compareCards('9', '8', 'h1', 'h2'));
    // Expect: winnerId: h1, value: 9

    try {
        compareCards('A', 'K', 'h1', 'h2');
    } catch (e: any) {
        console.log("Test 5 (Error):", e.message);
    }
}
