import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Render the 6x6 board grid
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const squaresInRow = [];
    for (let j = 0; j < 6; j++) {
      squaresInRow.push(
        <Square key={i * 6 + j} value={squares[i * 6 + j]} onSquareClick={() => handleClick(i * 6 + j)} />
      );
    }
    rows.push(<div key={i} className="board-row">{squaresInRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(36).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(36).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button className="reset-button" onClick={resetGame}>Restart Game</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [

    [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5],
    [6, 7, 8], [7, 8, 9], [8, 9, 10], [9, 10, 11],
    [12, 13, 14], [13, 14, 15], [14, 15, 16], [15, 16, 17],
    [18, 19, 20], [19, 20, 21], [20, 21, 22], [21, 22, 23],
    [24, 25, 26], [25, 26, 27], [26, 27, 28], [27, 28, 29],
    [30, 31, 32], [31, 32, 33], [32, 33, 34], [33, 34, 35],

    [0, 6, 12], [6, 12, 18], [12, 18, 24], [18, 24, 30],
    [1, 7, 13], [7, 13, 19], [13, 19, 25], [19, 25, 31],
    [2, 8, 14], [8, 14, 20], [14, 20, 26], [20, 26, 32],
    [3, 9, 15], [9, 15, 21], [15, 21, 27], [21, 27, 33],
    [4, 10, 16], [10, 16, 22], [16, 22, 28], [22, 28, 34],
    [5, 11, 17], [11, 17, 23], [17, 23, 29], [23, 29, 35],

    [0, 7, 14], [7, 14, 21], [14, 21, 28], [21, 28, 35],
    [1, 8, 15], [8, 15, 22], [15, 22, 29],
    [2, 9, 16], [9, 16, 23], [16, 23, 30],
    [3, 10, 17], [10, 17, 24], [17, 24, 31],
    [4, 11, 18], [11, 18, 25], [18, 25, 32],
    [5, 12, 19], [12, 19, 26], [19, 26, 33],

    [5, 10, 15], [10, 15, 20], [15, 20, 25], [20, 25, 30],
    [4, 9, 14], [9, 14, 19], [14, 19, 24],
    [3, 8, 13], [8, 13, 18], [13, 18, 23],
    [2, 7, 12], [7, 12, 17], [12, 17, 22],
    [1, 6, 11], [6, 11, 16], [11, 16, 21],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
