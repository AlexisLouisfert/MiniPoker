import { Card } from "./deck";

export type HandType = "High-Card" | "Pair" | "Straight" | "Flush" | "Straight-Flush" ;
export type Hand = {
    type: HandType,
    rank?: string,
    kicker?: string,
    cards: Card[]
};
export type Winner = {
    type: HandType | "Tie",
    rank?: string,
    cards: Card[]
};
const rankOrder: { [key: string]: number } = { "9": 0, "T": 1, "J": 2, "Q": 3, "K": 4, "A": 5 };

export function categorizeHand(cards: Card[]): Hand {
    // trie les cartes par rang decroissant
    cards.sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank]);

    if (isStraightFlush(cards)) {
        return {
            type: "Straight-Flush",
            cards: cards
        };
    }

    if (isStraight(cards)) {
        return {
            type: "Straight",
            cards: cards
        };
    }

    if (isFlush(cards)) {
        return {
            type: "Flush",
            cards: cards
        };
    }

    const pair = getPair(cards);
    if (pair) {
        return {
            type: "Pair",
            rank: pair.rank,
            kicker: pair.kicker,
            cards: cards
        };
    }

    // si c'est pas les autres, c'est High-Card
    return {
        type: "High-Card",
        cards: cards
    };
}

export function compare(hand1: Hand, hand2: Hand): Winner {
    
    // Mapping des types de main à des valeurs numériques
    const typeValues: { [key in HandType]: number } = {
        "Straight-Flush": 4,
        "Straight": 3,
        "Flush": 2,
        "Pair": 1,
        "High-Card": 0,
    };

    // Comparaison des types de main par leur valeur numérique
    const typeComparison = typeValues[hand1.type] - typeValues[hand2.type];
    if (typeComparison !== 0) {
        return typeComparison > 0 ? hand1 : hand2;
    }

    // Si les types de main sont les mêmes, utiliser les fonctions de comparaison spécifiques
    switch (hand1.type) {
        case "Straight-Flush":
            return compareStraightFlushes(hand1.cards, hand2.cards);
        case "Straight":
            return compareStraights(hand1.cards, hand2.cards);
        case "Flush":
            return compareFlushes(hand1.cards, hand2.cards);
        case "Pair":
            return comparePairs(hand1.rank!, hand2.rank!);
        case "High-Card":
            return compareHighCards(hand1.cards, hand2.cards);
        default:
            // Par défaut, retourne Tie avec l'une des mains
            return { type: "Tie", cards: hand1.cards };
    }
}

export function compareByRank(rank1: string, rank2: string): number {
    return rankOrder[rank1] - rankOrder[rank2];
}

function compareHighCards(cards1: Card[], cards2: Card[]): Winner {
    // Trie les cartes par ordre décroissant de valeur
    const sortedCards1 = cards1.sort((a, b) => compareByRank(b.rank, a.rank));
    const sortedCards2 = cards2.sort((a, b) => compareByRank(b.rank, a.rank));

    // Compare les cartes une par une jusqu'à ce qu'une différence soit trouvée
    for (let i = 0; i < sortedCards1.length; i++) {
        const comparison = compareByRank(sortedCards1[i].rank, sortedCards2[i].rank);
        if (comparison !== 0) {
            // Une différence a été trouvée, retourne le gagnant
            return comparison > 0 ? { type: "High-Card", cards: cards1 } : { type: "High-Card", cards: cards2 };
        }
    }
    // Si toutes les cartes sont égales, retourne l'une des mains
    return { type: "Tie", cards: cards1 };
}

function compareStraights(cards1: Card[], cards2: Card[]): Winner {
    // Trie les cartes par ordre décroissant de valeur
    const sortedCards1 = cards1.sort((a, b) => compareByRank(b.rank, a.rank));
    const sortedCards2 = cards2.sort((a, b) => compareByRank(b.rank, a.rank));

    // Compare les cartes une par une
    for (let i = 0; i < sortedCards1.length; i++) {
        const comparison = compareByRank(sortedCards1[i].rank, sortedCards2[i].rank);
        if (comparison !== 0) {
            return comparison > 0 ? { type: "Straight", cards: cards1 } : { type: "Straight", cards: cards2 };
        }
    }
    // Si toutes les cartes sont égales, retourne l'une des mains
    return { type: "Tie", cards: cards1 };
}

function compareFlushes(cards1: Card[], cards2: Card[]): Winner {
    // Trie les cartes par ordre décroissant de valeur
    const sortedCards1 = cards1.sort((a, b) => compareByRank(b.rank, a.rank));
    const sortedCards2 = cards2.sort((a, b) => compareByRank(b.rank, a.rank));

    // Compare les cartes une par une
    for (let i = 0; i < sortedCards1.length; i++) {
        const comparison = compareByRank(sortedCards1[i].rank, sortedCards2[i].rank);
        if (comparison !== 0) {
            return comparison > 0 ? { type: "Flush", cards: cards1 } : { type: "Flush", cards: cards2 };
        }
    }
    // Si toutes les cartes sont égales, retourne l'une des mains
    return { type: "Tie", cards: cards1 };
}

function compareStraightFlushes(cards1: Card[], cards2: Card[]): Winner {
    // Trie les cartes par ordre décroissant de valeur
    const sortedCards1 = cards1.sort((a, b) => compareByRank(b.rank, a.rank));
    const sortedCards2 = cards2.sort((a, b) => compareByRank(b.rank, a.rank));

    // Compare les cartes une par une
    for (let i = 0; i < sortedCards1.length; i++) {
        const comparison = compareByRank(sortedCards1[i].rank, sortedCards2[i].rank);
        if (comparison !== 0) {
            return comparison > 0 ? { type: "Straight-Flush", cards: cards1 } : { type: "Straight-Flush", cards: cards2 };
        }
    }
    // Si toutes les cartes sont égales, retourne l'une des mains
    return { type: "Tie", cards: cards1 };
}

function comparePairs(rank1: any, rank2: any): any {
    // Compare les valeurs des paires
    const pairComparison = compareByRank(rank1, rank2);
    if (pairComparison !== 0) {
        return pairComparison > 0 ? { type: "Pair", rank: rank1} : { type: "Pair", rank: rank2 };
    }
    // Si les paires sont de même valeur, retourne l'une des mains
    return { type: "Pair", rank: rank1 };
}

function getPair(cards: Card[]): { rank: string; kicker: string } | null {
    const rankCount: { [rank: string]: number } = {};
    cards.forEach(card => {
        rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    });
    for (const rank in rankCount) {
        if (rankCount[rank] === 2) {
            const otherCards = cards.filter(card => card.rank !== rank);
            return { rank: rank, kicker: otherCards[otherCards.length - 1].rank };
        }
    }
    return null;
}

function isFlush(cards: Card[]): boolean {
    return cards.every((card, index, array) => card.suit === array[0].suit);
}

function isStraight(cards: Card[]): boolean {
    const ranks = cards.map(card => rankOrder[card.rank]).sort((a, b) => a - b);
    for (let i = 0; i < ranks.length - 1; i++) {
        if (ranks[i + 1] !== ranks[i] + 1) {
            return false;
        }
    }
    return true;
}

function isStraightFlush(cards: Card[]): boolean {
    return isFlush(cards) && isStraight(cards);
}