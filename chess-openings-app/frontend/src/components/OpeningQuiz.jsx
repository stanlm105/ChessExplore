// Quiz: animate moves and ask user to identify the opening.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOpenings } from "../hooks/useOpenings";
import ChessBoard from "./ChessBoard";

const randInt = (n) => Math.floor(Math.random() * n);
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SETS = [
  { label: "Starter Opening Set", bucket: "starter" },
  { label: "Level 2 Set", bucket: "level2" },
  { label: "Wacky Set", bucket: "wacky" }, // new
];

export default function OpeningQuiz() {
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const bucket = SETS[activeSetIdx].bucket;
  const { data: openings, loading, error } = useOpenings(bucket);

  // quiz counters
  const [score, setScore] = useState(0);
  const [qCount, setQCount] = useState(0);

  // per-question state
  const [current, setCurrent] = useState(null);
  const [choices, setChoices] = useState([]);
  const [moveIdx, setMoveIdx] = useState(0);           // 0..len (one-shot anim)
  const [locked, setLocked] = useState(false);         // true after CORRECT
  const [result, setResult] = useState(null);          // 'correct' | 'wrong' | null
  // show moves progressively (no delayed reveal)
  const [wrong, setWrong] = useState(() => new Set()); // clicked incorrects
  const [showNext, setShowNext] = useState(false);     // show Next after correct
  // Round state: ask each opening once per round
  const [order, setOrder] = useState([]);              // queue of opening indices
  const [showFinal, setShowFinal] = useState(false);   // final score modal

  // Reset when switching sets
  useEffect(() => {
    setScore(0); setQCount(0);
    setCurrent(null); setChoices([]);
    setMoveIdx(0); setLocked(false);
  setResult(null);
    setWrong(new Set()); setShowNext(false);
    setOrder([]); setShowFinal(false);
  }, [bucket]);

  const prepareFromIndex = (idx, nextOrder) => {
    if (!openings?.length || idx == null) return;
    const correct = openings[idx];
    const pool = openings.filter((_, i) => i !== idx);
    const wrongs = shuffle(pool).slice(0, 3).map(o => o.name);
    const options = shuffle([correct.name, ...wrongs]);

    setOrder(nextOrder);
    setCurrent(correct);
    setChoices(options);
    setLocked(false);
    setResult(null);
    setQCount(c => c + 1);
    setWrong(new Set());
    setShowNext(false);
    setMoveIdx(1); // start anim immediately
  };

  const prepareQuestion = () => {
    if (!openings?.length) return;
    if (!order.length) { setShowFinal(true); return; }
    const [idx, ...rest] = order;
    prepareFromIndex(idx, rest);
  };

  // Start a fresh round when data is ready
  useEffect(() => {
    if (loading || !openings?.length) return;
    const indices = Array.from({ length: openings.length }, (_, i) => i);
    const shuffled = shuffle(indices);
    const [first, ...rest] = shuffled;
    setScore(0); setQCount(0); setShowFinal(false);
    prepareFromIndex(first, rest);
  }, [loading, openings]);

  // One-shot animation (progressive moves line)
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!current || locked) return;

    const len = current.moves?.length ?? 0;
  if (len <= 0) return;
  if (moveIdx >= len) { return; }

    timerRef.current = setTimeout(() => {
      setMoveIdx(i => Math.min(len, i + 1));
    }, 1000);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, locked, moveIdx]);

  // First `moveIdx` SAN moves are applied
  const shownMoves = useMemo(() => {
    if (!current) return [];
    return current.moves.slice(0, Math.max(0, Math.min(moveIdx, current.moves.length)));
  }, [current, moveIdx]);

  // Answer handling
  const handleAnswer = (name) => {
    if (!current || locked) return;

    if (name === current.name) {
      setResult("correct");
      // Only award a point if this is the first guess for this question
      setScore(s => (wrong.size === 0 ? s + 1 : s));
      setLocked(true);
      setShowNext(true);          // show "Next" instead of auto-advancing
    } else {
      setResult("wrong");
      setWrong(prev => new Set(prev).add(name));
    }
  };

  if (loading) return <div>Loading set…</div>;
  if (error)   return <div style={{ color: "#ff97a3" }}>Failed: {String(error.message || error)}</div>;
  if (!openings?.length) return <div>No openings for this set.</div>;

  return (
    <>
      <div className="game-header">
        <h1 className="game-title">Chess Openings Trainer</h1>

        <select
          className="set-select"
          value={activeSetIdx}
          onChange={(e) => setActiveSetIdx(Number(e.target.value))}
          aria-label="Select opening set"
        >
          {SETS.map((s, i) => <option key={s.bucket} value={i}>{s.label}</option>)}
        </select>

        <div className="score-wrap">
          <span>🏆 <strong>Score:</strong> {score}</span>
          <span>❓ <strong>Question:</strong> {qCount} / {openings.length}</span>
        </div>

  {/* header end */}
      </div>

{/* Progressive moves line */}
{current && (
  <div className="moves-line">Moves: {shownMoves.join(", ")}</div>
)}

<div className="board-row">
  {/* Board */}
  <div className="chessboard-housing">
    <ChessBoard moves={shownMoves} currentMoveIndex={shownMoves.length} />
  </div>

  {/* Choices & feedback */}
  <div className="side-col">
    <div className="choices" role="group" aria-label="Opening choices">
      {choices.map((name) => {
        const isWrong = wrong.has(name);
        return (
          <button
            key={name}
            onClick={() => handleAnswer(name)}
            disabled={locked || isWrong}
            className={`btn ${isWrong ? "btn-wrong" : ""}`}
            title={name}
          >
            {name}
          </button>
        );
      })}
    </div>

  {/* Feedback and Next */}
    {result === "wrong" && (
      <div className="result bad">❌ Try again!</div>
    )}

    {result === "correct" && current && (
      <>
        <div className="result ok">✅ Correct!</div>
        <div className="desc-box">
          <strong>{current.name}.</strong> {current.description}
        </div>
        <div>
          <button className="btn btn-primary" onClick={prepareQuestion}>
            Next ▶️
          </button>
        </div>
      </>
    )}
  </div>
</div>
      
      {/* Final score modal */}
      {showFinal && (
        <div
          role="dialog"
          aria-modal="true"
          className="modal-backdrop"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
        >
          <div
            className="modal"
            style={{ background: "#1f2937", color: "#fff", padding: 24, borderRadius: 8, width: "min(420px, 90vw)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", textAlign: "center" }}
          >
            <h2 style={{ marginTop: 0 }}>Round complete</h2>
            <p style={{ marginBottom: 16 }}>
              Your score: <strong>{score}</strong> / {qCount}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!openings?.length) { setShowFinal(false); return; }
                const indices = Array.from({ length: openings.length }, (_, i) => i);
                const shuffled = shuffle(indices);
                const [first, ...rest] = shuffled;
                setScore(0); setQCount(0); setShowFinal(false);
                prepareFromIndex(first, rest);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
