import { describe, expect, it } from "vitest";
import { categorizeHand, compare } from "../src/hand";

describe("Hand", () => {
    it("should categorize a high-card hand", () => {
        const cards = [{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♥" }];
        const hand = categorizeHand(cards);

        expect(hand.type).toBe("High-Card");
        expect(hand.cards).toBe(cards);
    });

    it("should categorize a pair hand", () => {
        const cards = [{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♥" }];
        const hand = categorizeHand(cards);

        expect(hand.type).toBe("Pair");
        expect(hand.rank).toBe("A");
        expect(hand.kicker).toBe("Q");
        expect(hand.cards).toBe(cards);
    });

    it("should categorize a straight hand", () => {
        const cards = [{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }];
        const hand = categorizeHand(cards);

        expect(hand.type).toBe("Straight");
        expect(hand.cards).toBe(cards);
    });

    it("should categorize a flush hand", () => {
        const cards = [{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♠" }];
        const hand = categorizeHand(cards);

        expect(hand.type).toBe("Flush");
        expect(hand.cards).toBe(cards);
    });

    it("should categorize a straight-flush hand", () => {
        const cards = [{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }];
        const hand = categorizeHand(cards);

        expect(hand.type).toBe("Straight-Flush");
        expect(hand.cards).toBe(cards);
    });

    it("should correctly compare hands", () => {
        const highCard = categorizeHand([{rank:"A",suit:"♠"},{rank:"Q",suit:"♠"},{rank:"T",suit:"♥"}])
        const pair = categorizeHand([{rank:"A",suit:"♠"},{rank:"Q",suit:"♠"},{rank:"A",suit:"♥"}])

        const winner = compare(highCard, pair)
        expect(winner.type).toBe("Pair")
    })
})