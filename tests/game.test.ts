import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createNewGame, dealCards, dealAdditionalCard, determineWinner, resetHand, ante, endGame, botPlay, showOpponentHand } from '../src/game';
import { createDeck, Card } from '../src/deck';
import { showPopup } from '../src/game';

describe('Poker Game Tests', () => {
  let game: any;
  let deck: Card[];
  let hands: { human: Card[], bot: Card[] };

  beforeEach(() => {
    game = createNewGame();
    deck = createDeck();
    hands = { human: [], bot: [] };
  });

  it('should create a new game with correct initial balances and hand state', () => {
    expect(game.balances.human).toBe(100);
    expect(game.balances.bot).toBe(100);
    expect(game.hand.stage).toBe("ante");
    expect(game.hand.currentPlayer).toBe("human");
    expect(game.hand.pot).toBe(0);
    expect(game.hand.bets.human).toBe(0);
    expect(game.hand.bets.bot).toBe(0);
  });

  it('should deal two cards to each player from the deck', () => {
    dealCards(game, hands, deck);
    expect(hands.human.length).toBe(2);
    expect(hands.bot.length).toBe(2);
    expect(deck.length).toBe(8);
  });

  it('should deal an additional card to each player', () => {
    dealCards(game, hands, deck);
    dealAdditionalCard(game, hands, deck);
    expect(hands.human.length).toBe(3);
    expect(hands.bot.length).toBe(3);
    expect(deck.length).toBe(6); 
  });

  it('should determine the winner and update balances correctly', () => {
    hands.human = [{ suit: '♥', rank: 'A' },{ suit: '♥', rank: 'K' },{ suit: '♥', rank: 'Q' }];
    hands.bot = [{ suit: '♠', rank: 'A' },{ suit: '♠', rank: 'K' }, { suit: '♠', rank: 'J' } ];
    game.balances.human -= 10;
    game.hand.bets.human += 10;
    game.balances.bot -= 10;
    game.hand.bets.bot += 10;
    game.hand.pot = 20;
    determineWinner(game, hands);
    expect(game.balances.human).toBe(110);
    expect(game.balances.bot).toBe(90);
  });

  it('should determine a tie and update balances correctly', () => {
    hands.human = [{ suit: '♥', rank: 'A' },{ suit: '♥', rank: 'K' },{ suit: '♥', rank: 'Q' }];
    hands.bot = [ { suit: '♠', rank: 'A' }, { suit: '♠', rank: 'K' }, { suit: '♠', rank: 'Q' }];
    game.balances.human -= 10;
    game.hand.bets.human += 10;
    game.balances.bot -= 10;
    game.hand.bets.bot += 10;
    game.hand.pot = 20;
    determineWinner(game, hands);

    expect(game.balances.human).toBe(100);
    expect(game.balances.bot).toBe(100);
  });

  it('should reset the hand correctly', () => {
    resetHand(game);
    expect(game.hand.stage).toBe("turn1");
    expect(game.hand.currentPlayer).toBe("human");
    expect(game.hand.pot).toBe(2);
    expect(game.hand.bets.human).toBe(0);
    expect(game.hand.bets.bot).toBe(0);
    expect(game.hand.isBotRaised).toBe(false);
  });
  
  it('doit ajuster les soldes et réinitialiser les paris après avoir ajouté à le pot', () => {
    ante(game);
    expect(game.balances.human).toEqual(99);
    expect(game.balances.bot).toEqual(99);
    expect(game.hand.pot).toEqual(2);
    expect(game.hand.bets.human).toEqual(0);
    expect(game.hand.bets.bot).toEqual(0);    
  });
  it('declare bot vainqueur si human n\'a plus de jetons', () => {
    game.balances.human = 0;
    endGame(game);
    expect(game.winner).toEqual('bot');
  });
  
  it('declare joueur vainqueur si bot n\'a plus de jetons', () => {
    game.balances.bot = 0;
    endGame(game);
    expect(game.winner).toEqual('Joueur');
  });
  
  it('ne doit rien faire si aucun joueur n\'a un solde nul', () => {
    game.balances.human = 10;
    game.balances.bot = 10;
    endGame(game);
    expect(game.winner).toBeUndefined();
  });
});

describe('Test de la fonction botPlay et showPopup', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('doit retourner "raise" ou "check" si playerBet est égal à 0', () => {
    const mathRandomSpy = vi.spyOn(Math, 'random');
    mathRandomSpy.mockReturnValueOnce(0.4); 
    expect(botPlay(0)).toBe("check");
    mathRandomSpy.mockReturnValueOnce(0.6);
    expect(botPlay(0)).toBe("raise");
  });

  it('doit retourner "call", "fold", ou "raise" si playerBet est supérieur à 0', () => {
    const mathRandomSpy = vi.spyOn(Math, 'random');
    mathRandomSpy.mockReturnValueOnce(0.4);
    expect(botPlay(10)).toBe("call");
    mathRandomSpy.mockReturnValueOnce(0.2); 
    mathRandomSpy.mockReturnValueOnce(0.7); 
    expect(botPlay(10)).toBe("fold");
    mathRandomSpy.mockReturnValueOnce(0.2);
    mathRandomSpy.mockReturnValueOnce(0.5);
    expect(botPlay(10)).toBe("raise");
  });
  it('doit afficher le message dans la console', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    const message = 'Test Message';
    showPopup(message);
    expect(consoleLogSpy).toHaveBeenCalledWith('Popup message:', message);
  });

  it('doit appeler console.error après plus de 10 tentatives', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    const message = 'Test Message';
    const retries = 11;
    showPopup(message, retries);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Maximum retries exceeded.');
  });

  it('ne devrait pas rappeler showPopup si someConditionNotMet est faux', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    const message = 'Test Message';
    showPopup(message);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });
});
describe('Test de la fonction showOpponentHand', () => {
  let game: any;
  let deck: Card[];
  let hands: { human: Card[], bot: Card[] };

  beforeEach(() => {
    game = createNewGame();
    deck = createDeck();
    game.hands = { human: [], bot: [] };
  });

  it('devrait retourner la main de l\'adversaire lorsque le joueur courant est "human" et qu\'il y a 3 cartes', () => {
    game.hand.currentPlayer = "human";
    game.hands.human = [{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }];
    game.hands.bot = [{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }];
    const result = showOpponentHand(game);

    expect(result.human).toEqual([{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }]);
    expect(result.bot).toEqual([{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }]);
  });

  it('devrait retourner la main de l\'adversaire lorsque le joueur courant est "bot" et qu\'il y a 3 cartes', () => {
    game.hand.currentPlayer = "bot";
    game.hands.human = [{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }];
    game.hands.bot = [{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }];
    const result = showOpponentHand(game);
    expect(result.bot).toEqual([{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }]);
    expect(result.human).toEqual([{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }]);
    
  });

  it('ne devrait rien retourner si le joueur courant est "human" et qu\'il n\'y a pas 3 cartes', () => {
    game.hand.currentPlayer = "human";
    game.hands.human = [{ suit: '♠', rank: 'A' }, { suit: '♥', rank: 'J' }];
    game.hands.bot = [{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }];
    const result = showOpponentHand(game);

    expect(result.human).toEqual([]);
    expect(result.bot).toEqual([]);
  });

  it('ne devrait rien retourner si le joueur courant est "bot" et qu\'il n\'y a pas 3 cartes', () => {
    game.hand.currentPlayer = "bot";
    game.hands.human = [{ suit: '♠', rank: 'A' }, { suit: '♥', rank: 'J' }];
    game.hands.bot = [{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }];
    const result = showOpponentHand(game);

    expect(result.human).toEqual([]);
    expect(result.bot).toEqual([]);
  });
});