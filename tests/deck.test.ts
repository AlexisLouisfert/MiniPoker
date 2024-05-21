import { describe, expect, it } from "vitest";
import { createDeck } from "../src/deck";

describe("Deck", () => {
    it("should create a deck", () => {  
        const deck = createDeck()
        expect(deck.length).toBe(12)
        expect(deck.filter(card => card.suit === "♠").length).toBe(6)
        expect(deck.filter(card => card.suit === "♥").length).toBe(6)  
    })

    it("should shuffle a deck", () => {
        const deck1 = createDeck()
        const deck2 = createDeck()
        expect(deck1).not.toEqual(deck2)
    })
})