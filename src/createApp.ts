import express from "express";
import { createDeck } from "./deck";
import { createNewGame, resetHand, determineWinner, dealCards, dealAdditionalCard, endGame, ante, showPopup, botPlay, showOpponentHand } from "./game";
//import session from "express-session";
import { handleAction, proceedToNextStage } from "./action";

export function createApp() {
  const app = express();
  let game: any = null;
  let hands: any = null;

  app.use(express.static("public"));
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.render("index", {
      game: game,
      hand: hands?.human,
    });
  });

  app.get("/opponent-hand", (req, res) => {
    const game = req.query.game;
    if (!game) {
      res.status(400).json({ message: "No game in progress" });
      return;
    }
    const opponentHand = showOpponentHand(game);
    res.json(opponentHand);
  });

  app.post("/new-game", (req, res) => {
    hands = {
      human: [],
      bot: [],
    };
    game = createNewGame();
    
    
    // Ante bet
    ante(game)

    game.hand.stage = "turn1";
    game.deck = createDeck();
    dealCards(game, hands, createDeck());
    console.log("new game")
    res.redirect("/");
  });

  app.get("/game-status", (req, res) => {
    res.json(game);
  });

  app.post("/play", (req, res) => {
    console.log("on joue")

    if (!game || game.hand.currentPlayer !== "human") {
      res.redirect("/");
      return;
    }

    handleAction(req, res, game, hands, game.deck);
    // if(req.body.action === "fold" || game.hand.stage === "endRound"){
    //   hands = {
    //     human: [],
    //     bot: [],
    //   };
    //   game = createNewHand();
      
      
    //   // Ante bet
    //   ante(game)
  
    //   game.hand.stage = "turn1";
    //   game.deck = createDeck();
    //   dealCards(game, hands, createDeck());
    //   console.log("new hand")
    //   res.redirect("/");
    // }
  });

  return app;
}