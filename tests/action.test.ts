import { describe, it, expect, beforeEach, vi} from 'vitest';
import { handleAction, proceedToNextStage } from '../src/action';
import { createNewGame, dealCards, showOpponentHand } from '../src/game';
import { createDeck, Card } from '../src/deck';
import { Request, Response } from 'express';

describe('Test de la fonction proceedToNextStage et handleAction', () => {
  let game: any;
  let deck: Card[];
  let hands: { human: Card[], bot: Card[] };

  beforeEach(() => {
    game = createNewGame();
    deck = createDeck();
    hands = { human: [], bot: [] };
  });

  it('devrait passer à la prochaine étape si les paris des joueurs sont égaux à la première étape', () => {
    game.hand.stage = "turn1";
    dealCards(game, hands, deck);
    game.hand.bets.human = 1;
    game.hand.bets.bot = 1;
    proceedToNextStage(game, hands, deck);
    expect(game.hand.stage).toBe("turn2");
    expect(game.hand.isBotRaised).toBe(false);
    expect(hands.human.length).toBe(3);
    expect(hands.bot.length).toBe(3);
    expect(deck.length).toBe(6);
  });

  it('devrait passer à la prochaine étape si les paris des joueurs sont égaux à la deuxième étape', () => {
    game.hand.stage = "turn2";
    game.hand.bets.human = 10;
    game.hand.bets.bot = 10;
    proceedToNextStage(game, hands, deck);
    expect(game.hand.stage).toBe("showDown");
    expect(game.hand.isBotRaised).toBe(false);
  });

  it('devrait passer à l\'étape "endRound" à la fin de l\'étape "showDown"', async () => {
    game.hand.stage = "showDown";
    game.hands = {  human : [{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }],
                    bot : [{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }]     };
    proceedToNextStage(game, hands, deck);
    expect(showOpponentHand(game).human).toEqual([{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }]);
    expect(showOpponentHand(game).bot).toEqual([{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }]);
    expect(game.hand.stage).toBe("endRound");
  });

  it('devrait déclarer un de manche et/ou de partie à la fin de l\'étape "endRound"', async () => {
    game.hand.stage = "endRound";
    game.balances.human -= 100;
    game.hand.bets.human += 100;
    game.balances.bot -= 100;
    game.hand.bets.bot += 100;
    game.hand.pot = 200;
    hands.human = [{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }];
    hands.bot = [{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }];
    proceedToNextStage(game, hands, deck);
    expect(game.winner).toEqual('bot');
    expect(game.balances.bot).toBe(200);
    expect(game.balances.human).toBe(0);
  });
});

//--------------------------------------
describe('Test de la fonction handleAction', () => {
    let game: any;
    let deck: Card[];
    let hands: { human: Card[], bot: Card[] };
    let req: Request;
    let res: Response;
    
  
    beforeEach(() => {
      game = createNewGame();
      deck = createDeck();
      hands = { human: [], bot: [] };
      req = {
        body: {}
      } as Request;
      res = {
        redirect: vi.fn()
      } as unknown as Response;
    });
  
    it('devrait gérer l\'action "bet" correctement', () => {
      req.body!.action = 'bet';
      req.body!.amount = '10'; 
      game.hand.stage = "turn1";
      game.hand.isBotRaised = false;
      game.hand.bets.human = 0;
      game.balances.human = 100;
      handleAction(req, res, game, hands, deck);
      expect(game.hand.bets.human).toBe(10);
      expect(game.balances.human).toBe(90); 
      expect(game.hand.currentPlayer).toBe('bot'); 
    });
  
    it('devrait gérer l\'action "call" correctement', () => {
      req.body!.action = 'call';
      game.hand.stage = "turn1";
      game.hand.isBotRaised = true;
      game.hand.bets.human = 0;
      game.hand.bets.bot = 10;
      game.balances.human = 100;
      handleAction(req, res, game, hands, deck);
      expect(game.balances.human).toBe(90);
      expect(game.hand.pot).toBe(20); // Pot should now include both bets
      expect(game.hand.bets.human).toBe(0); // Bets should be reset after moving to next stage
      expect(game.hand.bets.bot).toBe(0);
    });
  
    it('devrait gérer l\'action "fold" correctement', () => {
      req.body!.action = 'fold';
      game.hand.stage = "turn1";
      game.hand.currentPlayer = "human";
      game.hand.bets.human = 0;
      game.hand.bets.bot = 10;
      game.hand.pot += game.hand.bets.bot;
      game.hand.pot += game.hand.bets.bot;
      handleAction(req, res, game, hands, deck);
      expect(game.hand.pot).toBe(10); 
      expect(game.balances.bot).toBe(110); 
    });
  
    it('devrait gérer l\'action "show" correctement', () => {
    req.body!.action = 'show';
    game.hand.stage = "showDown";
    hands.human = [{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }];
    hands.bot = [{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }];
    game.hands = hands;
    handleAction(req, res, game, hands, deck);
    const opponentHands = showOpponentHand(game);
    expect(opponentHands.human).toEqual([{ suit: '♠', rank: 'K' }, { suit: '♥', rank: 'Q' }, { suit: '♠', rank: 'J' }]);
    expect(opponentHands.bot).toEqual([{ suit: '♠', rank: 'A' }, { suit: '♠', rank: 'T' }, { suit: '♠', rank: '9' }]);
    expect(game.hand.stage).toBe("endRound");
    if (game.hand.stage === "endRound") {
        proceedToNextStage(game, hands, deck);
        expect(game.hand.stage).toBe("turn1");
    }
  });
});