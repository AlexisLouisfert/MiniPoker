import { describe, expect, it } from "vitest";
import { categorizeHand, compare } from "../src/hand";

describe("hand comparison", () => {
    it("must compare a high-card hand vs a pair hand", () => {
        const highCard = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }, { rank: "T", suit: "♥" }]);
        const pair = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♥" }]);

        const winner = compare(highCard, pair);
        expect(winner.type).toBe("Pair");
    });

    it("must compare a high-card hand vs a Straight hand", () => {
        const highCard = categorizeHand([{ rank: "A", suit: "♥" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♥" }]);
        const Straight = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }]);

        const winner = compare(highCard, Straight);
        expect(winner.type).toBe("Straight");
    });

    it("must compare a high-card hand vs a flush hand", () => {
        const highCard = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }, { rank: "T", suit: "♥" }]);
        const flush = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♠" }]);

        const winner = compare(highCard, flush);
        expect(winner.type).toBe("Flush");
    });

    it("must compare a high-card hand vs a Straight-flush hand", () => {
        const highCard = categorizeHand([{ rank: "A", suit: "♥" }, { rank: "Q", suit: "♥" }, { rank: "T", suit: "♠" }]);
        const StraightFlush = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }]);

        const winner = compare(highCard, StraightFlush);
        expect(winner.type).toBe("Straight-Flush");
    });

    it("must compare a pair hand vs a Straight hand", () => {
        const pair = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♥" }]);
        const Straight = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }]);

        const winner = compare(pair, Straight);
        expect(winner.type).toBe("Straight");
    });

    it("must compare a pair hand vs a flush hand", () => {
        const pair = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♥" }]);
        const flush = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♠" }]);

        const winner = compare(pair, flush);
        expect(winner.type).toBe("Flush");
    });

    it("must compare a pair hand vs a Straight-flush hand", () => {
        const pair = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♥" }]);
        const StraightFlush = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }]);

        const winner = compare(pair, StraightFlush);
        expect(winner.type).toBe("Straight-Flush");
    });

    it("must compare a Straight hand vs a Flush hand", () => {
        const straight = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }]);
        const flush = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♠" }]);

        const winner = compare(straight, flush);
        expect(winner.type).toBe("Straight");
    });

    it("must compare a Straight hand vs a Straight-flush hand", () => {
        const Straight = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }]);
        const StraightFlush = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }]);

        const winner = compare(Straight, StraightFlush);
        expect(winner.type).toBe("Straight-Flush");
    });

    it("must compare a flush hand vs a Straight-flush hand", () => {
        const flush = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♠" }]);
        const StraightFlush = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }]);

        const winner = compare(flush, StraightFlush);
        expect(winner.type).toBe("Straight-Flush");
    });

    it("must compare two High-Card hands with different high cards", () => {
        const highCard1 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }, { rank: "9", suit: "♠" }]);
        const highCard2 = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "J", suit: "♥" }, { rank: "Q", suit: "♠" }]);
    
        const winner = compare(highCard1, highCard2);
        expect(winner.type).toBe("High-Card");
        expect(winner.cards[0].rank).toBe("A");
    });

    it("must compare two pairs hands with different high pairs", () => {
        const pair1 = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♥" }]);
        const pair2 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }, { rank: "K", suit: "♥" }]);

        const winner = compare(pair1, pair2);
        expect(winner.type).toBe("Pair");
        expect(winner.rank).toBe("A");
    });

    it("must compare two flush hands with different high cards", () => {
        const flush1 = categorizeHand([{ rank: "A", suit: "♥" }, { rank: "Q", suit: "♥" }, { rank: "T", suit: "♥" }]);
        const flush2 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♠" }]);

        const winner = compare(flush1, flush2);
        expect(winner.type).toBe("Flush");
        expect(winner.cards[0].rank).toBe("A");
    });

    it("must compare two Straight hands with different high cards", () => {
        const straight1 = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }]);
        const straight2 = categorizeHand([{ rank: "K", suit: "♥" }, { rank: "Q", suit: "♠" }, { rank: "J", suit: "♥" }]);

        const winner = compare(straight1, straight2);
        expect(winner.type).toBe("Straight");
        expect(winner.cards[0].rank).toBe("A");
    });

    it("must compare two Straight-Flush hands with different high cards", () => {
        const straightFlush1 = categorizeHand([{ rank: "A", suit: "♥" }, { rank: "K", suit: "♥" }, { rank: "Q", suit: "♥" }]);
        const straightFlush2 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "J", suit: "♠" }]);

        const winner = compare(straightFlush1, straightFlush2);
        expect(winner.type).toBe("Straight-Flush");
        expect(winner.cards[0].rank).toBe("A");
    });
    it("must compare two High-Card hands with same high cards", () => {
        const highCard1 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }, { rank: "9", suit: "♠" }]);
        const highCard2 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "9", suit: "♥" }, { rank: "Q", suit: "♠" }]);
    
        const winner = compare(highCard1, highCard2);
        expect(winner.type).toBe("Tie");
    });

    it("must compare two flush hands with same high cards", () => {
        const flush1 = categorizeHand([{ rank: "K", suit: "♥" }, { rank: "Q", suit: "♥" }, { rank: "T", suit: "♥" }]);
        const flush2 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "T", suit: "♠" }]);

        const winner = compare(flush1, flush2);
        expect(winner.type).toBe("Tie");
    });

    it("must compare two Straight hands with same high cards", () => {
        const straight1 = categorizeHand([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }, { rank: "Q", suit: "♥" }]);
        const straight2 = categorizeHand([{ rank: "K", suit: "♥" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♥" }]);

        const winner = compare(straight1, straight2);
        expect(winner.type).toBe("Tie");
    });

    it("must compare two Straight-Flush hands with same high cards", () => {
        const straightFlush1 = categorizeHand([{ rank: "A", suit: "♥" }, { rank: "K", suit: "♥" }, { rank: "Q", suit: "♥" }]);
        const straightFlush2 = categorizeHand([{ rank: "K", suit: "♠" }, { rank: "Q", suit: "♠" }, { rank: "A", suit: "♠" }]);

        const winner = compare(straightFlush1, straightFlush2);
        expect(winner.type).toBe("Tie");
    });
});