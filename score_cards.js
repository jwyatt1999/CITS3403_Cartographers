function scoreGreen(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == FARM) {
                console.log("Found a farm!!");
            }
        }
    }
}