
import React from "react";
import { Chessboard } from "react-chessboard";
import PromotionDialog from "./PromotionDialog";
import "../styles/CheesGame.css";

const ChessBoardUI = ({
  screen,
  scores,
  gameStatus,
  fen,
  highlightSquares,
  onDrop,
  onSquareClick,
  showPopup,
  popupMessage,
  selectMode,
  startSinglePlayer,
  // startTwoPlayer,
  resetGame,
  setScreen,
  promotionDialog,
  onPromotionSelect,
}) => (
  <div className="container">
    {screen === "mode" && (
      <>
        <h1>Chess Game</h1>
        <div className="mode-buttons">
          <button className="mode-button" onClick={() => selectMode("single")}>
            Single Player
          </button>
          <button className="mode-button" onClick={() => selectMode("two")}>
            Two Player
          </button>
        </div>
      </>
    )}
    {screen === "difficulty" && (
      <>
        <h1>Chess Game</h1>
        <div className="difficulty-buttons">
          <button
            className="difficulty-button"
            onClick={() => startSinglePlayer("Normal")}
          >
            Normal
          </button>
          <button
            className="difficulty-button"
            onClick={() => startSinglePlayer("Intermediate")}
          >
            Intermediate
          </button>
          <button
            className="difficulty-button"
            onClick={() => startSinglePlayer("Hard")}
          >
            Hard
          </button>
        </div>
        <button className="back-button" onClick={() => setScreen("mode")}>
          Back to Mode Selection
        </button>
      </>
    )}
    {screen === "chessboard" && (
      <>
        <h1>Chess Game</h1>
        <button className="back-button" onClick={resetGame}>
          Back to Mode Selection
        </button>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
        <div className="scores">
          <span>White: {scores.white} points</span>
          <span>Black: {scores.black} points</span>
        </div>
        <p className="status">{gameStatus}</p>
        <div className="chessboard-container">
          <Chessboard
            position={fen}
            onDrop={onDrop}
            onSquareClick={onSquareClick}
            boardStyle={{ borderRadius: "5px" }}
            darkSquareStyle={{ backgroundColor: "#779952" }}
            lightSquareStyle={{ backgroundColor: "#edeed1" }}
            width={400}
            className="chessboard"
            customSquareStyles={highlightSquares}
          />
        </div>
        {promotionDialog && promotionDialog.show && (
          <PromotionDialog
            color={promotionDialog.color === "w" ? "w" : "b"}
            onSelect={onPromotionSelect}
          />
        )}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <p style={{ whiteSpace: "pre-line" }}>{popupMessage}</p>
              <button className="popup-button" onClick={resetGame}>
                Restart New Game
              </button>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);

export default ChessBoardUI ;
