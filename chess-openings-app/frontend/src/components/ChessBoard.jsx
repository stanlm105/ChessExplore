import React, { useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

/**
 * Read-only chessboard that derives a FEN by applying SAN moves in order.
 * Pass the first N moves to animate progress through an opening.
 *
 * @param {Object} props
 * @param {string[]} [props.moves] SAN moves to apply in order
 * @param {number} [props.currentMoveIndex] how many moves to apply (<= moves.length)
 */
export default function ChessBoard({ moves = [], currentMoveIndex = 0 }) {
  const fen = useMemo(() => {
    const game = new Chess();
    const upto = Math.min(currentMoveIndex, moves.length);
    for (let i = 0; i < upto; i++) {
      const m = (moves[i] ?? "").toString().trim();
      try { if (!game.move(m, { sloppy: true })) break; } catch { break; }
    }
    return game.fen();
  }, [moves, currentMoveIndex]);

  return (
    <div style={{ width: 360, maxWidth: "100%" }}>
      <Chessboard
        position={fen}
        arePiecesDraggable={false}
        arePiecesAnimated={true}
        animationDuration={300}
        boardWidth={360}
      />
    </div>
  );
}
