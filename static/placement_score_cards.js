"use strict";

/**
 * Returns an array of the placement score cards in this file.
 * When adding a new score card to this file, you must also add the score card
 * to this method for it to be used in the game.
 */
 function getPlacementScoreCards() {
    let placementScoreCards = [];
    placementScoreCards.push({type:"Placement", name:"Borderlands",     function:scoreCard_Borderlands,
        description:"Earn six points for each complete row or complete column of filled spaces."});
    placementScoreCards.push({type:"Placement", name:"The Cauldrons",   function:scoreCard_TheCauldrons,
        description:"Earn one point for each empty space surrounded on all four sides by filled spaces or the edge of the board."});
    placementScoreCards.push({type:"Placement", name:"The Broken Road", function:scoreCard_TheBrokenRoad,
        description:"Earn three points for each complete diagonal line of filled spaces that touches the left and bottom edges of the board."});
    return placementScoreCards;
}

/**
 * Earn six points for each complete row or complete column of filled spaces.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_Borderlands(gameBoard) {
    //Iterate over the columns
    for (let i = 0; i < gameBoard.length; i++) {
        let completelyFilled = true;
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[j][i] == EMPTY) {
                completelyFilled = false;
            }
        }
        if (completelyFilled) {
            playerPoints += 6;
        }
    }
    //Iterate over the rows
    for (let i = 0; i < gameBoard.length; i++) {
        let completelyFilled = true;
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == EMPTY) {
                completelyFilled = false;
            }
        }
        if (completelyFilled) {
            playerPoints += 6;
        }
    }
}

/**
 * Earn one point for each empty space surrounded on all four sides by filled
 * spaces or the edge of the board.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_TheCauldrons(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == EMPTY) {
                if ((i-1) >= 0) {
                    if (gameBoard[i-1][j] == EMPTY) {
                        continue;
                    }
                }
                if ((j-1) >= 0) {
                    if (gameBoard[i][j-1] == EMPTY) {
                        continue;
                    }
                }
                if ((i+1) < gameBoard.length) {
                    if (gameBoard[i+1][j] == EMPTY) {
                        continue;
                    }
                }
                if ((j+1) < gameBoard.length) {
                    if (gameBoard[i][j+1] == EMPTY) {
                        continue;
                    }
                }
                //If we got here then the empty space is surrounded by filled spaces / the edge of the board.
                playerPoints++;
            }
        }
    }
}

/**
 * Earn three points for each complete diagonal line of filled spaces that touches the left
 * and bottom edges of the board.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_TheBrokenRoad(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        let filledDiagonally = true;
        for (let j = 0; j < gameBoard[0].length-i; j++) {
            if (gameBoard[i+j][j] == EMPTY) {
                filledDiagonally = false;
            }
        }
        if (filledDiagonally) {
            playerPoints += 3;
        }
    }
}