"use strict";

function scoreCardRed(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == VILLAGE) {
                playerPoints += 2;
            }
        }
    }
}