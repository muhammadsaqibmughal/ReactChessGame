
import { Chess } from "chess.js";

const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export function createGame(fen) {
  return fen ? new Chess(fen) : new Chess();
}

export function evaluateBoard(game, difficulty) {
  const board = game.board();
  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type] * (piece.color === "w" ? 1 : -1);
        score += value;
        if (
          difficulty !== "Normal" &&
          [3, 4].includes(i) &&
          [3, 4].includes(j)
        ) {
          score += piece.color === "w" ? 0.1 : -0.1;
        }
      }
    }
  }
  return score;
}

export function minimax(game, depth, alpha, beta, isMaximizing, difficulty) {
  if (depth === 0 || game.isGameOver()) {
    return { score: evaluateBoard(game, difficulty) };
  }
  const moves = game.moves();
  let bestMove = null;
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(
        game,
        depth - 1,
        alpha,
        beta,
        false,
        difficulty
      ).score;
      game.undo();
      if (evalScore > maxEval) {
        maxEval = evalScore;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(
        game,
        depth - 1,
        alpha,
        beta,
        true,
        difficulty
      ).score;
      game.undo();
      if (evalScore < minEval) {
        minEval = evalScore;
        bestMove = move;
      }
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return { score: minEval, move: bestMove };
  }
}

export function computerMove(
  game,
  difficulty,
  setScores,
  setFen,
  setGame,
  setSelectedSquare,
  setHighlightSquares,
  checkGameStatus
) {
  const moves = game.moves();
  if (moves.length === 0) return;
  let move;
  if (difficulty === "Normal") {
    const captures = moves.filter((m) => m.includes("x"));
    move =
      captures.length > 0
        ? captures[Math.floor(Math.random() * captures.length)]
        : moves[Math.floor(Math.random() * moves.length)];
  } else if (difficulty === "Intermediate") {
    let bestScore = -Infinity;
    for (const m of moves) {
      game.move(m);
      const score = evaluateBoard(game, difficulty);
      game.undo();
      if (score > bestScore) {
        bestScore = score;
        move = m;
      }
    }
  } else if (difficulty === "Hard") {
    const result = minimax(game, 3, -Infinity, Infinity, false, difficulty);
    move = result.move;
  }
  const moveResult = game.move(move);
  if (moveResult && moveResult.captured) {
    const points = pieceValues[moveResult.captured];
    setScores((prev) => ({ ...prev, black: prev.black + points }));
  }
  setFen(game.fen());
  setGame(createGame(game.fen()));
  setSelectedSquare(null);
  setHighlightSquares({});
  checkGameStatus();
}

export function getPossibleMoves(game, square) {
  try {
    const moves = game.moves({ square, verbose: true });
    return moves.map((move) => move.to);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function getPieceValues() {
  return pieceValues;
}

export function isPromotionMove(piece, from, to) {
  if (!piece || piece.type !== "p") return false;
  const lastRank = piece.color === "w" ? "8" : "1";
  return to[1] === lastRank;
}
