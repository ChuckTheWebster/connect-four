"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1;
let board = [];

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    const newRow = Array.from({ length: WIDTH }).fill(null);
    board.push(newRow);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `c-${y}-${x}`);
      row.append(cell);
    }

    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  let bottomEmpty;
  let highestNonEmpty = board.findIndex(row => row[x] !== null);

  if (highestNonEmpty === -1) {
    bottomEmpty = board.length - 1;
  } else if (highestNonEmpty === 0) {
    return null;
  } else {
    bottomEmpty = highestNonEmpty - 1;
  }

  return bottomEmpty;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const gamePieceDiv = document.createElement('div');
  let gamePiecePlayerId = (currPlayer === 1) ? 'p1' : 'p2';
  gamePieceDiv.classList.add('piece', gamePiecePlayerId);

  const targetCell = document.getElementById(`c-${y}-${x}`);
  targetCell.append(gamePieceDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  let x = +evt.target.id;
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  placeInTable(y, x);
  board[y][x] = (currPlayer === 1) ? 1 : 2;

  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  let filled = board.every(row => row.every(cell => cell !== null));
  if (filled) {
    return endGame('Game over. Everyone loses.');
  }

  currPlayer = (currPlayer === 1) ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    let cellsAreValid = cells.every(cell => cell[0] < HEIGHT && cell[0] >= 0 && cell[1] < WIDTH && cell[1] >= 0);

    if (!cellsAreValid) {
      return false;
    }

    let cellsMatch = cells.every(cell => board[cell[0]][cell[1]] === currPlayer);
    return cellsMatch;
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
