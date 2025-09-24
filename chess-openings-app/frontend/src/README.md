# Chess Openings App Frontend

This is the frontend part of the Chess Openings App, built using React. The application allows users to learn and identify chess openings through interactive animations.

## Getting Started

To get started with the frontend, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd chess-openings-app
   cd frontend
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then, run:
   ```
   npm install
   ```

3. **Run the application**:
   Start the development server with:
   ```
   npm run dev
   ```
   By default Vite serves on http://localhost:5173 and proxies API calls to http://localhost:8000.

## Project Structure

- `src/`: Contains all the source code for the React application.
  - `App.jsx`: Main application component.
  - `components/`: Contains reusable components.
    - `OpeningSelector.jsx`: Component for selecting chess opening sets.
    - `ChessBoard.jsx`: Component for displaying the chessboard and animating moves.
    - `MultipleChoice.jsx`: Component for presenting multiple-choice questions.
  - `data/`: Contains data related to chess openings.

## Features

- Select between "Starter Opening Set" and "Level 2 Set."
- Animated chess moves for each opening.
- Multiple-choice questions to identify the openings.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.