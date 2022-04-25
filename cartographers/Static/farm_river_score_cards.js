"use strict";

/**
 * Returns an array of the farm-river score cards in this file.
 * When adding a new score card to this file, you must also add the score card
 * to this method for it to be used in the game.
 */
 function getFarmRiverScoreCards() {
    let farmRiverScoreCards = [];
    farmRiverScoreCards.push({type:"FarmRiver", name:"Canal Lake",   function:scoreCard_CanalLake, 
        description:"Earn one point for each river space adjacent to at least one farm space, and earn one point for each farm space adjacent to at least one river space."});
    farmRiverScoreCards.push({type:"FarmRiver", name:"Mages Valley", function:scoreCard_MagesValley,
        description:"Earn two points for each river space adjacent to a mountain space, and earn one point for each farm space adjacent to a mountain space."});
    farmRiverScoreCards.push({type:"FarmRiver", name:"Jorekburg",    function:scoreCard_Jorekburg,
        description:"Earn four points for each column that contains an equal number of farm paces and river spaces. There must be at least one of each."});
    return farmRiverScoreCards;
}

/**
 * Earn one point for each river space adjacent to at least one farm space, and
 * earn one point for each farm space adjacent to at least one river space.
 * @param {*} gameBoard The board to score
 */
function scoreCard_CanalLake(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == FARM || gameBoard[i][j] == RIVER) {
                let typeAdjacentShouldBe = 0;
                if (gameBoard[i][j] == FARM) {
                    typeAdjacentShouldBe = RIVER;
                } else {
                    typeAdjacentShouldBe = FARM;
                }
                if ((i-1) >= 0) {
                    if (gameBoard[i-1][j] == typeAdjacentShouldBe) {
                        playerPoints++;
                        continue;
                    }
                }
                if ((j-1) >= 0) {
                    if (gameBoard[i][j-1] == typeAdjacentShouldBe) {
                        playerPoints++;
                        continue;
                    }
                }
                if ((i+1) < gameBoard.length) {
                    if (gameBoard[i+1][j] == typeAdjacentShouldBe) {
                        playerPoints++;
                        continue;
                    }
                }
                if ((j+1) < gameBoard.length) {
                    if (gameBoard[i][j+1] == typeAdjacentShouldBe) {
                        playerPoints++;
                        continue;
                    }
                }
            } 
        }
    }
}

/**
 * Earn two points for each river space adjacent to a mountain space, and
 * earn one point for each farm space adjacent to a mountain space.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_MagesValley(gameBoard) {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == MOUNTAIN || gameBoard[i][j] == MOUNTAIN_CLAIMED) {
                if ((i-1) >= 0) {
                    if (gameBoard[i-1][j] == RIVER) {
                        playerPoints += 2;
                    } else if (gameBoard[i-1][j] == FARM) {
                        playerPoints++;
                    }
                }
                if ((j-1) >= 0) {
                    if (gameBoard[i][j-1] == RIVER) {
                        playerPoints += 2;
                    } else if (gameBoard[i][j-1] == FARM) {
                        playerPoints++;
                    }
                }
                if ((i+1) < gameBoard.length) {
                    if (gameBoard[i+1][j] == RIVER) {
                        playerPoints += 2;
                    } else if (gameBoard[i+1][j] == FARM) {
                        playerPoints++;
                    }
                }
                if ((j+1) < gameBoard.length) {
                    if (gameBoard[i][j+1] == RIVER) {
                        playerPoints += 2;
                    } else if (gameBoard[i][j+1] == FARM) {
                        playerPoints++;
                    }
                }
            }
        }
    }
}

/**
 * Earn four points for each column that contains an equal number of farm 
 * spaces and river spaces. There must be at least one of each.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_Jorekburg(gameBoard) {
    //Iterate over the columns of the gameboard, keeping track of the number of rivers and farms.
    for (let i = 0; i < gameBoard.length; i++) {
        let riverCount = 0;
        let farmCount = 0;
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[j][i] == RIVER) {
                riverCount++;
            } else if (gameBoard[j][i] == FARM) {
                farmCount++;
            }
        }
        if (riverCount == farmCount && riverCount != 0) {
            playerPoints += 4;
        }
    }
}