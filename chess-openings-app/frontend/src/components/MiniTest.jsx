// src/components/MiniTest.jsx
import React, { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";

export default function MiniTest() {
  const full = ["e4", "e5", "Nf3", "Nc6", "Bb5"]; // Ruy Lopez sample
  const [i, setI] = useState(1);                  // 1..full.length

  useEffect(() => {
    const id = setInterval(() => setI(x => (x % full.length) + 1), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-4 space-y-2">
      <div>MiniTest moveIdx: {i}</div>
      <ChessBoard moves={full.slice(0, i)} currentMoveIndex={i} />
    </div>
  );
}
