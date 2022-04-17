"use strict";

function scoreCardBlueYellow(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == RIVER || gameBoard[i][j] == FARM) {
                playerPoints += 1;
            }
        }
    }
}