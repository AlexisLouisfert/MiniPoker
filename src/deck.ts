export function createDeck() : Card[]{
    const cards : Card[] = []
    for(let suit of ["♠", "♥"]) {
        for(let rank of ["9", "T", "J", "Q", "K","A"]) {
            cards.push({rank, suit})
        }
    }
    shuffleCards(cards)
    return cards
}
export function shuffleCards(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}
export type Card = {
    rank: string
    suit: string
}
