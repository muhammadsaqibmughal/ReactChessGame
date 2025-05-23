import React, { useState, useEffect } from "react";
import ChessBoardUI from "./ChessBoardUI";
import {
  createGame,
  computerMove,
  getPossibleMoves,
  getPieceValues,
  isPromotionMove,
} from "./logics/gameLogic";

const CheesGame = () => {
  const [game, setGame] = useState(createGame());
  const [fen, setFen] = useState(game.fen());
  const [difficulty, setDifficulty] = useState(null);
  const [gameStatus, setGameStatus] = useState(
    "Select a mode to start the game."
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [screen, setScreen] = useState("mode");
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [highlightSquares, setHighlightSquares] = useState({});
  const [gameMode, setGameMode] = useState(null);
  const [scores, setScores] = useState({ white: 0, black: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [promotionDialog, setPromotionDialog] = useState({
    show: false,
    from: null,
    to: null,
    color: null,
  });

  const pieceValues = getPieceValues();

  // Load game state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("chessGameState");
      if (savedState) {
        const {
          fen,
          difficulty,
          gameStatus,
          isGameStarted,
          screen,
          gameMode,
          scores,
          showPopup,
          popupMessage,
          promotionDialog,
        } = JSON.parse(savedState);
        if (fen) {
          const newGame = createGame(fen);
          setGame(newGame);
          setFen(fen);
        }
        setDifficulty(difficulty || null);
        setGameStatus(gameStatus || "Select a mode to start the game.");
        setIsGameStarted(isGameStarted || false);
        setScreen(screen || "mode");
        setGameMode(gameMode || null);
        setScores(scores || { white: 0, black: 0 });
        setShowPopup(showPopup || false);
        setPopupMessage(popupMessage || "");
        setPromotionDialog(
          promotionDialog || { show: false, from: null, to: null, color: null }
        );
      }
    } catch (error) {
      console.log("Error loading game state:", error);
    }
  }, []);

  // Save game state to localStorage
  const saveGameState = () => {
    try {
      const state = {
        fen,
        difficulty,
        gameStatus,
        isGameStarted,
        screen,
        gameMode,
        scores,
        showPopup,
        popupMessage,
        promotionDialog,
      };
      localStorage.setItem("chessGameState", JSON.stringify(state));
    } catch (error) {
      console.log("Error saving game state:", error);
    }
  };

  const checkGameStatus = () => {
    try {
      if (!game || typeof game.isCheckmate !== "function") {
        setGameStatus("Error: Invalid game state");
        saveGameState();
        return;
      }

      if (game.isCheckmate()) {
        const winner =
          game.turn() === "w"
            ? gameMode === "single"
              ? "Computer Wins!"
              : "Player 2 Wins!"
            : gameMode === "single"
            ? "You Win!"
            : "Player 1 Wins!";
        setPopupMessage(
          `${winner}\n\nFinal Score:\nWhite: ${scores.white} points\nBlack: ${scores.black} points`
        );
        setShowPopup(true);
        setIsGameStarted(false);
      } else if (game.isStalemate()) {
        setPopupMessage(
          `Stalemate! It's a draw!\n\nFinal Score:\nWhite: ${scores.white} points\nBlack: ${scores.black} points`
        );
        setShowPopup(true);
        setIsGameStarted(false);
      } else if (game.isDraw()) {
        setPopupMessage(
          `Draw by insufficient material or repetition!\n\nFinal Score:\nWhite: ${scores.white} points\nBlack: ${scores.black} points`
        );
        setShowPopup(true);
        setIsGameStarted(false);
      } else {
        setGameStatus(
          game.isCheck()
            ? "Check!"
            : `${game.turn() === "w" ? "White's" : "Black's"} turn.`
        );
      }
      saveGameState();
    } catch (error) {
      console.log(error);
      setGameStatus("Error: Game state issue");
      saveGameState();
    }
  };

  // Handle promotion
  const handlePromotion = (promotion) => {
    const { from, to } = promotionDialog;
    const currentTurn = game.turn();
    const move = game.move({
      from,
      to,
      promotion,
    });
    if (move && move.captured) {
      const points = pieceValues[move.captured];
      setScores((prev) => ({
        ...prev,
        [currentTurn === "w" ? "white" : "black"]:
          prev[currentTurn === "w" ? "white" : "black"] + points,
      }));
    }
    setFen(game.fen());
    setGame(createGame(game.fen()));
    setSelectedSquare(null);
    setHighlightSquares({});
    setPromotionDialog({ show: false, from: null, to: null, color: null });
    checkGameStatus();
    if (gameMode === "single" && game.turn() === "b" && !game.isGameOver()) {
      setTimeout(
        () =>
          computerMove(
            game,
            difficulty,
            setScores,
            setFen,
            setGame,
            setSelectedSquare,
            setHighlightSquares,
            checkGameStatus
          ),
        500
      );
    }
    saveGameState();
  };

  // Handle click for promotion and highlighting
  const handleSquareClick = (square) => {
    if (!isGameStarted || showPopup) return;
    try {
      const piece = game.get(square);
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setHighlightSquares({});
        return;
      }
      if (selectedSquare) {
        const currentTurn = game.turn();
        const from = selectedSquare;
        const to = square;
        if (isPromotionMove(game.get(from), from, to)) {
          setPromotionDialog({
            show: true,
            from,
            to,
            color: game.get(from).color,
          });
          saveGameState();
          return;
        }
        const move = game.move({
          from,
          to,
          promotion: "q",
        });
        if (move !== null) {
          if (move.captured) {
            const points = pieceValues[move.captured];
            setScores((prev) => ({
              ...prev,
              [currentTurn === "w" ? "white" : "black"]:
                prev[currentTurn === "w" ? "white" : "black"] + points,
            }));
          }
          setFen(game.fen());
          setGame(createGame(game.fen()));
          checkGameStatus();
          setSelectedSquare(null);
          setHighlightSquares({});
          if (
            gameMode === "single" &&
            game.turn() === "b" &&
            !game.isGameOver()
          ) {
            setTimeout(
              () =>
                computerMove(
                  game,
                  difficulty,
                  setScores,
                  setFen,
                  setGame,
                  setSelectedSquare,
                  setHighlightSquares,
                  checkGameStatus
                ),
              500
            );
          }
        } else {
          setSelectedSquare(null);
          setHighlightSquares({});
        }
        saveGameState();
        return;
      }
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const possibleMoves = getPossibleMoves(game, square);
        const highlightStyles = possibleMoves.reduce(
          (acc, moveSquare) => ({
            ...acc,
            [moveSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
          }),
          {}
        );
        setHighlightSquares(highlightStyles);
      }
    } catch (error) {
      console.log(error);
      setSelectedSquare(null);
      setHighlightSquares({});
    }
  };

  // Drag-and-drop handler: Only allow legal moves
  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (!isGameStarted || showPopup) return false;
    try {
      const piece = game.get(sourceSquare);
      if (!piece || piece.color !== game.turn()) return false;
      const possibleMoves = getPossibleMoves(game, sourceSquare);
      if (!possibleMoves.includes(targetSquare)) return false;

      // Handle promotion
      if (isPromotionMove(piece, sourceSquare, targetSquare)) {
        setPromotionDialog({
          show: true,
          from: sourceSquare,
          to: targetSquare,
          color: piece.color,
        });
        saveGameState();
        return false; // Wait for promotion selection
      }

      const currentTurn = game.turn();
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return false;

      if (move.captured) {
        const points = pieceValues[move.captured];
        setScores((prev) => ({
          ...prev,
          [currentTurn === "w" ? "white" : "black"]:
            prev[currentTurn === "w" ? "white" : "black"] + points,
        }));
      }
      setFen(game.fen());
      setGame(createGame(game.fen()));
      setSelectedSquare(null);
      setHighlightSquares({});
      checkGameStatus();

      if (gameMode === "single" && game.turn() === "b" && !game.isGameOver()) {
        setTimeout(
          () =>
            computerMove(
              game,
              difficulty,
              setScores,
              setFen,
              setGame,
              setSelectedSquare,
              setHighlightSquares,
              checkGameStatus
            ),
          500
        );
      }
      saveGameState();
      return true; // Legal move
    } catch (error) {
      console.log(error);
      return false; // Prevent illegal move on error
    }
  };

  const startSinglePlayer = (selectedDifficulty) => {
    try {
      const newGame = createGame();
      setGame(newGame);
      setFen(newGame.fen());
      setDifficulty(selectedDifficulty);
      setGameMode("single");
      setIsGameStarted(true);
      setGameStatus("White's turn.");
      setScreen("chessboard");
      setScores({ white: 0, black: 0 });
      setShowPopup(false);
      saveGameState();
    } catch (error) {
      console.log(error);
      setGameStatus("Error: Failed to start game");
      saveGameState();
    }
  };

  const startTwoPlayer = () => {
    try {
      const newGame = createGame();
      setGame(newGame);
      setFen(newGame.fen());
      setDifficulty(null);
      setGameMode("two");
      setIsGameStarted(true);
      setGameStatus("White's turn.");
      setScreen("chessboard");
      setScores({ white: 0, black: 0 });
      setShowPopup(false);
      saveGameState();
    } catch (error) {
      console.log(error);
      setGameStatus("Error: Failed to start game");
      saveGameState();
    }
  };

  const selectMode = (mode) => {
    setGameMode(mode);
    if (mode === "single") {
      setScreen("difficulty");
    } else {
      startTwoPlayer();
    }
    saveGameState();
  };

  const resetGame = () => {
    try {
      const newGame = createGame();
      setGame(newGame);
      setFen(newGame.fen());
      setDifficulty(null);
      setIsGameStarted(false);
      setGameStatus("Select a mode to start the game.");
      setScreen("mode");
      setSelectedSquare(null);
      setHighlightSquares({});
      setGameMode(null);
      setScores({ white: 0, black: 0 });
      setShowPopup(false);
      setPopupMessage("");
      setPromotionDialog({ show: false, from: null, to: null, color: null });
      localStorage.removeItem("chessGameState"); // Clear localStorage on reset
    } catch (error) {
      console.log(error);
      setGameStatus("Error: Failed to reset game");
    }
  };

  return (
    <ChessBoardUI
      screen={screen}
      scores={scores}
      gameStatus={gameStatus}
      fen={fen}
      highlightSquares={highlightSquares}
      onDrop={onDrop}
      onSquareClick={handleSquareClick}
      showPopup={showPopup}
      popupMessage={popupMessage}
      selectMode={selectMode}
      startSinglePlayer={startSinglePlayer}
      resetGame={resetGame}
      setScreen={setScreen}
      promotionDialog={promotionDialog}
      onPromotionSelect={handlePromotion}
    />
  );
};

export default CheesGame;
