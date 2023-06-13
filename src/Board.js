import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  /** set the board in state && create new board to begin game  */
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    // create array-of-arrays of true/false values
    const genRows = (ncols) => {
      // create a row of length ncols of randomly assigned t/f values
      const row = [...Array(ncols)].map((r) => {
        let randIdx = Math.round(Math.random());
        //
        return randIdx === 0 ? true : false;
      });
      initialBoard.push(row);
    };

    [...Array(nrows)].map((r) => genRows(ncols));

    return initialBoard;
  }

  /** render a board nrows high/ncols wide, each cell with props:
   * isLit: true or false based on currBoard
   * flipCellsAround: function defined below
   */
  function makeBoard() {
    return board.map((row, y) => {
      return (
        <tr key={y}>
          {row.map((cell, x) => {
            return (
              <Cell
                flipCellsAroundMe={flipCellsAround}
                isLit={cell}
                key={x}
                coord={`${y}-${x}`}
              />
            );
          })}
        </tr>
      );
    });
  }

  /** Check to see if game is over
   *      board = [[t,t,t], ...etc ])
   * */
  const hasWon = () => {
    // Check the board in state to determine whether the player has won.
    let results = [];
    board.forEach((row) => {
      let res = row.filter((item) => !item);
      if (res.length > 0) {
        results.push("false");
      }
    });
    return results.length > 0 ? false : true;
  };

  /** Flips cells
   *        and changes state of board
   *
   * Note: click is handled in <Cell>
   * */

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      let boardCopy = oldBoard.map((row) => [...row]);

      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      // flip cells above, below, next to (right and left)
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      // return the copy
      return boardCopy;
    });
  }

  //** RENDER:  */

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div>
        <p>You won!</p>
      </div>
    );
  }
  // otherwise, render gameBoard:
  else {
    return (
      <div className="Board">
        <table className="Board-table">
          <tbody>{makeBoard()}</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
