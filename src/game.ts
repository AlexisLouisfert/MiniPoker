import { Card, createDeck } from "./deck";
import { compare, categorizeHand, Hand, Winner } from "./hand";

export function createNewGame(){
  return {
    balances: {
      human: 100,
      bot: 100,
    },
    hand: {
      stage: "ante",  
      currentPlayer: "human",
      pot: 0,
      bets: {
        human: 0,
        bot: 0,
      },
      isBotRaised: false,
    },
    
  };
}

export function resetHand(game: any) {
game.hand.stage = "ante";
game.hand.currentPlayer = "human";
game.hand.pot = 0;
game.hand.bets.human = 0;
game.hand.bets.bot = 0;
game.hand.isBotRaised = false;
ante(game);
game.hand.stage = "turn1";
console.log("new Round")
}

export function determineWinner(game: any, hands: any) {
  const humanHand: Hand = categorizeHand(hands.human);
  const botHand: Hand = categorizeHand(hands.bot);
  const result: Winner = compare(humanHand, botHand);

  if (result.type === "Tie") {
    game.balances.human += game.hand.pot / 2;
    game.balances.bot += game.hand.pot / 2;
    game.result="Both";
    showPopup('The round is Tie');
  } else if (result.type === humanHand.type) {
    game.balances.human += game.hand.pot;
    game.result="Joueur";
    showPopup('Winner of the round is Human');
  } else {
    game.balances.bot += game.hand.pot;
    game.result="Bot";
    showPopup('Winner of the round is Bot');
  }
  endGame(game)
  resetHand(game);
}



export function dealCards(game: any, hands: any, deck: Card[]) {
  hands.human = [];
  hands.bot = [];

  for (let i = 0; i < 2; i++) {
    hands.human.push(deck.pop());
    hands.bot.push(deck.pop());
  }
}

export function dealAdditionalCard(game: any, hands: any, deck: Card[]) {
  hands.human.push(deck.pop());
  hands.bot.push(deck.pop());
}

export function ante(game: any){
    game.balances.human -= 1;
    game.hand.bets.human += 1;
    game.balances.bot -= 1;
    game.hand.bets.bot += 1;
    game.hand.pot += 2;
    game.hand.bets.human = 0;
    game.hand.bets.bot = 0;
}

export function botPlay(playerBet: number): string {
  if (playerBet === 0) {
    return Math.random() > 0.5 ? "raise" : "check";
  } else {
    return Math.random() > 0.33 ? "call" : (Math.random() > 0.66 ? "fold" : "raise");
  }
}

export function endGame(game: any) {
  if (game.balances.human === 0) {
    game.winner = "bot";
    showPopup('Winner of the game is Bot');
  } else if (game.balances.bot === 0) {
    game.winner = "Joueur";
    showPopup('Winner of the game is Joueur');
  } else {
    return;
  }
}

export function showOpponentHand(game: any) {
  const humanHand = game.hands.human;
  const botHand = game.hands.bot;
  
  if (humanHand.length === 3 && botHand.length === 3) {
    return {
      human: game.hand.currentPlayer === "human" ? botHand : humanHand,
      bot: game.hand.currentPlayer === "bot" ? botHand : humanHand,
    };
  }

  return { human: [], bot: [] };
}

export function showPopup(message: string, retries: number = 0): void {
  if (retries > 10) { 
      console.error('Maximum retries exceeded.');
      return;
  }
  console.log('Popup message:', message);
  if (someConditionNotMet()) {
      showPopup(message, retries + 1);
  }
}
export function someConditionNotMet(): boolean {
  return false; 
}