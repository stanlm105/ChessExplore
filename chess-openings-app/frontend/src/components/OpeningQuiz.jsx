// src/components/OpeningQuiz.jsx
// Quiz flow: pick a random opening from the selected set, animate its moves,
// and prompt the user to identify it from four options. Only advance after a
// correct answer; show flavor text and a Next button.
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

  // Reset when switching sets
  useEffect(() => {
    setScore(0); setQCount(0);
    setCurrent(null); setChoices([]);
    setMoveIdx(0); setLocked(false);
  setResult(null);
    setWrong(new Set()); setShowNext(false);
  }, [bucket]);

  const prepareQuestion = () => {
    if (!openings?.length) return;
    const idx = randInt(openings.length);
    const correct = openings[idx];
    const pool = openings.filter((_, i) => i !== idx);
    const wrongs = shuffle(pool).slice(0, 3).map(o => o.name);
    const options = shuffle([correct.name, ...wrongs]);

    setCurrent(correct);
    setChoices(options);
    setLocked(false);
    setResult(null);
    setQCount(c => c + 1);
    setWrong(new Set());
    setShowNext(false);

    // start anim immediately; step every ~1s until end
    setMoveIdx(1);
  };

  // Start first question when data arrives
  useEffect(() => {
    if (!loading && openings?.length && !current) prepareQuestion();
  }, [loading, openings, current]);

  // One-shot animation (2s). Reveal "Moves:" only after finishing.
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

  // Send exactly the first `moveIdx` SANs to the board
  const shownMoves = useMemo(() => {
    if (!current) return [];
    return current.moves.slice(0, Math.max(0, Math.min(moveIdx, current.moves.length)));
  }, [current, moveIdx]);

  // Answer handling: only advance after correct; wrongs stay red/disabled
  const handleAnswer = (name) => {
    if (!current || locked) return;

    if (name === current.name) {
      setResult("correct");
      setScore(s => s + 1);
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
          <span>❓ <strong>Questions:</strong> {qCount}</span>
        </div>

        {/* Pause button removed per request */}
      </div>

{/* "Moves" stays hidden until animation completes */}
{current && (
  <div className="moves-line">Moves: {shownMoves.join(", ")}</div>
)}

<div className="board-row">
  {/* Left: the board */}
  <div className="chessboard-housing">
    <ChessBoard moves={shownMoves} currentMoveIndex={shownMoves.length} />
  </div>

  {/* Right: choices, then result/description/Next */}
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

    {/* Feedback + Flavor text + NEXT (now in the right column) */}
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
      
    </>
  );
}
