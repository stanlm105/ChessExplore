# <img src="assets/chess_logo.png" width=200><br>ChessExplore

> A tiny monorepo for learning and teaching chess openings.  
> The flagship app is an **Opening Trainer** that plays a line on the board (smoothly 🧈)—you guess the name, get instant feedback, and level up your pattern recognition.

<p align="center">
  <img src="assets/sample_openingstrainer.png" alt="Chess Openings Trainer screenshot" width="720" />
</p>


- 🌐 **Try it:** https://chessopenings.messierexplore.com


---

---

## What’s inside

- `chess-openings-app/` – React + Vite web app with an animated board, multiple-choice quiz, scoring, and three curated opening sets.
- `assets/` – screenshots & visuals.

> Built as a hands-on way to practice openings recognition (and to have something more fun than a PDF of lines 😄).

---

## Opening Trainer — highlights

- **Plays the opening**: one move every **2 seconds**, smooth piece animation.
- **Guess the name**: 4 choices; wrong picks turn **red** (disabled); keep trying until you’re right.
- **No spoilers**: the full move list reveals **only after** the animation completes.
- **Correct ⇒ flavor text** (quick description) + **Next** button to load a new puzzle.
- **Scoreboard**, “felt” table theme, responsive layout.

### Sets included

- **Starter (10)** – Ruy Lopez, Sicilian, French, Caro-Kann, Italian, Queen’s Gambit, King’s Indian, English, Nimzo-Indian, Scotch.  
- **Level 2 (16)** – adds **QGD**, **Slav**, **Petroff**, **Berlin**, **London**, **Sicilian Najdorf**, plus Grünfeld, Benoni, Pirc, Dutch, Alekhine, Catalan, King’s Gambit, Evans, Two Knights, Scandinavian.  
- **Wacky (12)** – Bongcloud, Halloween, Stafford, Wayward Queen, Grob, Orangutan (Sokolsky), Danish, Englund, Latvian, Fried Liver, **Elephant**, **Scotch Gambit**.

---

## Quickstart (Docker Compose)

```bash
# build & run from repo root
docker compose up --build

# app will be available at
# http://localhost:8000
```

**Configure API base (optional):** If you have a backend at a different URL/port, pass it at build time:

```bash
VITE_API_BASE=http://localhost:8000 docker compose up --build
```

The app expects endpoints like `/api/openings/<set>` where `<set>` is `starter`, `level2`, or `wacky`.

> Compose expects the frontend in `chess-openings-app/` with a Vite build output in `dist/` (Dockerfile handles the build).

---

## Tech stack

- **React 18.2 + Vite**
- **react-chessboard 4.x** (board), **chess.js** (rules / SAN→FEN)
- Plain CSS for the “dark green felt” look

---

## Project layout

```
chess-openings-app/
  Dockerfile                  # multi-stage (Node build -> Nginx)
  nginx.conf                  # SPA routing for Nginx
  src/
    api/openingsClient.js     # tiny fetch wrapper (supports VITE_API_BASE)
    components/
      ChessBoard.jsx          # computes FEN from SAN; smooth piece animation
      OpeningQuiz.jsx         # quiz state machine: animation, choices, scoring
    hooks/useOpenings.js      # simple fetch + cache
    styles.css                # felt theme + UI polish
    App.jsx, main.jsx
assets/
  sample_openingstrainer.png
docker-compose.yml            # builds and serves frontend on :8080
```

---

## Design notes & lessons learned

- **Animation model**: render the first `k` SAN moves and let `react-chessboard` animate between positions (don’t remount the board).
- **Timing**: self-scheduling `setTimeout` at **2s per move** to keep dev behavior predictable.
- **UX guardrails**: hide the move list until the animation finishes; wrong answers turn red (and disable) to give feedback without spoiling future guesses.
- **Routing**: Nginx SPA fallback routes unknown paths to `index.html`.
- **Containerization**: Vite env (`VITE_API_BASE`) wired as a **build arg** so the compiled app points at your API.

---

## Future ideas

- Sound FX + per-move progress ring  
- Fun ELO popularity stats per opening, mention famous players related to that opening/historical notes
- One or two continuation lines to inform best routes when encountering this opening

---

## License

MIT — see [`LICENSE`](LICENSE).

