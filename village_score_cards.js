"use strict";

/**
 * Earn eight points for each distinct cluster of six or more village spaces.
 * Adjacency is only determined orthogonally.
 * @param {*} gameBoard The board to score
 */
function scoreCard_Wildholds(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == VILLAGE) {
                playerPoints += 2;
            }
        }
    }
}

/**
 * Earn three points for each distinct cluster of villages that is adjacent
 * to three or more different terrain types.
 * Empty is not a terrain type.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_GreengoldPlains(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == VILLAGE) {
                playerPoints += 2;
            }
        }
    }
}

/**
 * Earn one point for each village space in the largest cluster of village
 * spaces that is not adjacent to a mountain space.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_GreatCity(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == VILLAGE) {
                playerPoints += 2;
            }
        }
    }
}