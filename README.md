# ChessMaster: A Modern Chess Game with Single and Two-Player Modes
 

ChessMaster is an interactive, feature-rich chess game built with React, offering both single-player (vs. AI) and two-player modes. With a sleek UI, persistent game state using localStorage, and robust game logic powered by chess.js, this project delivers a seamless chess experience for casual players and enthusiasts alike. Whether you're challenging the computer at varying difficulty levels or competing against a friend, ChessMaster combines modern web technologies with classic gameplay.

### 🔗 **[Live Demo →](https://react-chess-game-nu.vercel.app/)**

## 🚀 Features
**Single-Player Mode:** Play against an AI opponent with adjustable difficulty levels, powered by intelligent move evaluation.<br>
**Two-Player Mode:** Enjoy head-to-head matches on the same device, perfect for local multiplayer.<br>
**Persistent State: **Game progress is saved to localStorage, allowing you to resume exactly where you left off after a page refresh.<br>
**Pawn Promotion:** Seamlessly handle pawn promotions with an intuitive dialog for selecting pieces (queen, rook, bishop, knight).<br>
**Score Tracking:** Keep track of captured pieces with a scoring system based on piece values.<br>
**Game Status Updates:** Real-time feedback on check, checkmate, stalemate, or draw conditions.<br>
**Drag-and-Drop Interface:** Move pieces with smooth drag-and-drop or click-based controls, built with react-chessboard.<br>
**Responsive Design:** Play on desktop or mobile with a clean, modern UI.<br>
**Error Handling:** Robust error handling ensures a stable experience even with unexpected inputs or edge cases.<br>
## 🛠️ Technologies Used
**React:** Frontend framework for building a dynamic and responsive UI.<br>
**chess.js:** Chess logic library for move validation, board state management, and FEN (Forsyth-Edwards Notation) handling.<br>
**react-chessboard:** Component for rendering an interactive chessboard.<br>
**localStorage:** Persists game state (board position, scores, mode, etc.) across sessions.<br>
**JavaScript (ES6+):** Core programming language for game logic and state management.<br>
**CSS:** Custom styles for a polished and user-friendly interface.<br>
## 🎮 Getting Started
Prerequisites<br>
Node.js (v16 or higher)<br>
npm or yarn<br>

**Installation<br>**<br>

Clone the repository:<br>
bash<br>
`git clone https://github.com/muhammadsaqibmughal/reactchessgame.git`<br>

Navigate to the project directory:<br>
bash<br>
`cd chessmaster`<br>

Install dependencies:<br>
bash<br>
`npm install`

Start the development server:<br>
bash<br>
`npm start`<br>

Open http://localhost:3000 in your browser to start playing!<br>


## 🧠 How It Works
**Game State Management:** Uses React hooks (useState, useEffect) to manage the game state, including board position (fen), scores, and game mode.<br>
**Persistence:** Saves the entire game state to localStorage after every move, ensuring seamless resumption after a refresh.<br>
**AI Opponent:** Implements a computer player with configurable difficulty, leveraging chess.js for legal move generation and evaluation.<br>
**UI/UX:** Combines react-chessboard for the board and custom components for mode selection, game status, and popups.<br>

## 🤝 Contributing
Contributions are welcome! Whether it's adding new features, fixing bugs, or improving the AI, your input can make ChessMaster even better. 
To contribute:<br>
Fork the repository.<br>
Create a new branch: git checkout -b feature/your-feature.<br>
Commit your changes: git commit -m "Add your feature".<br>
Push to the branch: git push origin feature/your-feature.<br>
Open a Pull Request.<br>

Please read our Contributing Guidelines for more details.<br>


## 🌟 Why ChessMaster?
ChessMaster is not just a game—it's a showcase of modern web development with React, state management, and persistent storage. Whether you're a developer looking to study a well-structured React project or a chess enthusiast wanting a polished gaming experience, ChessMaster has something for you. Try it out, contribute, or use it as inspiration for your own projects!

## 📬 Contact
Have questions or suggestions? _(https://github.com/muhammadsaqibmughal)_
