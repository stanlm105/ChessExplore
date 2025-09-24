// src/App.jsx — top-level shell component
import React from "react";
import OpeningQuiz from "./components/OpeningQuiz";

/**
 * App root: centers the quiz layout.
 */
export default function App() {
  return (
    <div className="app-center">
      <div className="game-shell">
        <OpeningQuiz />
      </div>
    </div>
  );
}
