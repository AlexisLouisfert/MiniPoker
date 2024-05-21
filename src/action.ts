import { botPlay, dealAdditionalCard, determineWinner, endGame, resetHand, showOpponentHand, showPopup } from "./game";
import { Request, Response, response } from 'express';

export function proceedToNextStage(game: any, hands: any, deck: any) {
    if (game.hand.stage === "turn1") {
      if (game.hand.bets.human === game.hand.bets.bot) {
        game.hand.stage = "turn2";
        game.hand.bets.human = 0;
        game.hand.bets.bot = 0;
        game.hand.isBotRaised = false;
        game.hand.currentPlayer = "human";
        dealAdditionalCard(game, hands, deck);
        console.log("goes to turn2")
      } else if (game.hand.bets.human > game.hand.bets.bot){
        game.hand.currentPlayer = "bot";
      } else if (game.hand.bets.human < game.hand.bets.bot) {
        game.hand.currentPlayer = "human";
        game.hand.isBotRaised = true;
      } else {
         console.log("system fatal error, restart your game")
      }
    } else if (game.hand.stage === "turn2") {
      if (game.hand.bets.human === game.hand.bets.bot) {
        game.hand.stage = "showDown";
        game.hand.bets.human = 0;
        game.hand.bets.bot = 0;
        game.hand.isBotRaised = false;
        game.hand.currentPlayer = "human";
        console.log("goes to showdown")
      } else if (game.hand.bets.human > game.hand.bets.bot){
        game.hand.currentPlayer = "bot";
      } else if (game.hand.bets.human < game.hand.bets.bot) {
        game.hand.currentPlayer = "human";
        game.hand.isBotRaised = true;
      } else {
         console.log("system fatal error, restart your game")
      } 
    } else if (game.hand.stage === "showDown") {
      console.log("goes to endRound")
      game.hand.bets.human = 0;
      game.hand.bets.bot = 0;
      //showOpponentHand(game);
      game.hand.stage = "endRound";
    } else if (game.hand.stage === "endRound") {
      determineWinner(game, hands);
      console.log("determine le gagagnant")
    } else {
  
    }
}

export function handleAction(req: Request, res: Response, game: any, hands: any, deck: any) {
    const action = req.body.action;
    
     if (action === "bet" && game.hand.isBotRaised === false && (game.hand.stage === "turn1" || game.hand.stage === "turn2")) {
      const amount = parseInt(req.body.amount || "1");
      game.hand.bets.human += amount;
      game.balances.human -= amount; 
      game.hand.currentPlayer = "bot";
      console.log("human bet")
      setTimeout(() => {
        const botAction = botPlay(game.hand.bets.human);
        if (botAction === "fold" && (game.hand.stage === "turn1" || game.hand.stage === "turn2")) {
          game.hand.pot += game.hand.bets.human;
          game.hand.pot += game.hand.bets.bot;
          game.balances.human += game.hand.pot;
          game.hand.bets.human = 0;
          game.hand.bets.bot = 0;
          console.log("bot fold")
          showPopup('Winner of the round is Human');
          game.result="Joueur";
          endGame(game);
          resetHand(game);
        } else if (botAction === "call" && (game.hand.stage === "turn1" || game.hand.stage === "turn2")) {
          game.hand.bets.bot += game.hand.bets.human;
          game.balances.bot -= game.hand.bets.human;
          game.hand.pot += game.hand.bets.human * 2;
          game.hand.bets.human = 0;
          game.hand.bets.bot = 0;
          console.log("bot call")
          proceedToNextStage(game, hands, deck);
        } else if (botAction === "raise" && (game.hand.stage === "turn1" || game.hand.stage === "turn2")) {
          const botRaiseAmount = 2; 
          game.hand.bets.bot += game.hand.bets.human + botRaiseAmount;
          game.balances.bot -= game.hand.bets.human + botRaiseAmount;
          game.hand.currentPlayer = "human"; 
          game.hand.isBotRaised = true;
          console.log("bot raise")
        }
        game.hand.currentPlayer = "human";
        res.redirect("/");
      }, 5000);
    } else if (action === "check" && game.hand.isBotRaised === false && (game.hand.stage === "turn1" || game.hand.stage === "turn2"))  {
      console.log("human check")
      game.hand.currentPlayer = "bot";
      setTimeout(() => {
        const botAction = botPlay(0);
        if (botAction === "raise" && (game.hand.stage === "turn1" || game.hand.stage === "turn2")) {
          console.log("bot raise")
          const botRaiseAmount = 2;
          game.hand.bets.bot += game.hand.bets.human + botRaiseAmount;
          game.balances.bot -= game.hand.bets.human + botRaiseAmount;
          game.hand.currentPlayer = "human";
          game.hand.isBotRaised = true; 
        } else {
          console.log("bot check")
          proceedToNextStage(game, hands, deck);
        }
        res.redirect("/");
      }, 5000);
    } else if (action === "call" && game.hand.isBotRaised === true && (game.hand.stage === "turn1" || game.hand.stage === "turn2")) {
        console.log("human call")
        game.hand.bets.human += game.hand.bets.bot;
        game.balances.human -= game.hand.bets.bot;
        game.hand.pot += game.hand.bets.bot * 2;
        game.hand.bets.human = 0;
        game.hand.bets.bot = 0;
        proceedToNextStage(game, hands, deck);
    } else if (action === "fold") {
        game.hand.pot += game.hand.bets.human;
        game.hand.pot += game.hand.bets.bot;
        game.balances.bot += game.hand.pot;
        game.hand.bets.human = 0;
        game.hand.bets.bot = 0;
        showPopup('Winner of the round is Bot');
        game.result="Bot";
        endGame(game);
        resetHand(game);
        res.redirect("/");
    } else if (action === "show" && game.hand.stage === "showDown") { 
      console.log("show cards");  
        //showOpponentHand(game);
        proceedToNextStage(game, hands, deck);
        res.redirect("/");
    } else if (action === "next" && game.hand.stage === "endRound") { 
      console.log("end round")     
        proceedToNextStage(game, hands, deck);
        res.redirect("/");
    }  else {
        res.redirect("/");
    }
}