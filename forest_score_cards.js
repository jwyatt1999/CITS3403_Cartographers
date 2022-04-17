"use strict";

/**
 * Earn one point for each forest space adjacent to the edge of the map.
 * @param {*} gameBoard The board to score
 */
function scoreCard_SentinelWood(gameBoard) {
    //Count along the left and right edges of the board simultaneously.
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i][0] == FOREST) {
            playerPoints++;
        }
        if (gameBoard[i][gameBoard.length-1] == FOREST) {
            playerPoints++;
        }
    }
    //Count along the top and bottom edges of the board simultaneously.
    //Skip the corners of the board because they would have been checked in the loop above.
    for (let i = 1; i < gameBoard.length-1; i++) {
        if (gameBoard[0][i] == FOREST) {
            playerPoints++;
        }
        if (gameBoard[gameBoard.length-1][i] == FOREST) {
            playerPoints++;
        }
    }
}

/**
 * Earn one point for each row and each column with at least one forest space.
 * The same forest space may be scored in a row and a column.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_Greenbough(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == FOREST) {
                playerPoints += 2;
            }
        }
    }
}

/**
 * Earn two points for each forest space in the longest unbroken column of forest spaces.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_FaunlostThicket(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == FOREST) {
                playerPoints += 2;
            }
        }
    }
}