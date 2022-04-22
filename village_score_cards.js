"use strict";

/**
 * Returns an array of the village score cards in this file.
 * When adding a new score card to this file, you must also add the score card
 * to this method for it to be used in the game.
 */
 function getVillageScoreCards() {
    let villageScoreCards = [];
    villageScoreCards.push({type:"Village", name:"Wildholds",        function:scoreCard_Wildholds, 
        description:"Earn eight points for each distinct cluster of six or more village spaces."});
    villageScoreCards.push({type:"Village", name:"Greengold Plains", function:scoreCard_GreengoldPlains, 
        description:"Earn three points for each distinct cluster of villages that is adjacent to three or more different non-empty terrain types."});
    villageScoreCards.push({type:"Village", name:"Great City",       function:scoreCard_GreatCity, 
        description:"Earn one point for each village space in the largest cluster of village spaces that is not adjacent to a mountain space."});
    return villageScoreCards;
}

/**
 * Earn eight points for each distinct cluster of six or more village spaces.
 * Adjacency is only determined orthogonally.
 * @param {*} gameBoard The board to score
 */
function scoreCard_Wildholds(gameBoard) {
    //This array holds the village spaces we have checked, to prevent double counting spaces as we are traversing the board space
    //by space and also exploring each village cluster.
    let checkedSpaces = [];
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == VILLAGE && !checkedSpaces.includes([i,j],0)) {
                //If we get here then we are in a new cluster.
                let currentClusterSpacesToCheck = [];
                currentClusterSpacesToCheck.push([i,j]);
                checkedSpaces += [i,j];
                let currentClusterSize = 1;
                //Explore the village cluster to determine it's size.
                while (currentClusterSpacesToCheck.length > 0) {
                    let clusterSpace = currentClusterSpacesToCheck.pop();
                    let clusterSpace_i = clusterSpace[0];
                    let clusterSpace_j = clusterSpace[1];
                    if ((clusterSpace_i-1) >= 0) {
                        if (gameBoard[clusterSpace_i-1][clusterSpace_j] == VILLAGE && !checkedSpaces.includes([clusterSpace_i-1,clusterSpace_j],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i-1,clusterSpace_j]);
                            checkedSpaces += [clusterSpace_i-1,clusterSpace_j];
                            currentClusterSize++;
                        }
                    }
                    if ((clusterSpace_j-1) >= 0) {
                        if (gameBoard[clusterSpace_i][clusterSpace_j-1] == VILLAGE && !checkedSpaces.includes([clusterSpace_i,clusterSpace_j-1],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i,clusterSpace_j-1]);
                            checkedSpaces += [clusterSpace_i,clusterSpace_j-1];
                            currentClusterSize++;
                        }
                    }
                    if ((clusterSpace_i+1) < gameBoard.length) {
                        if (gameBoard[clusterSpace_i+1][clusterSpace_j] == VILLAGE && !checkedSpaces.includes([clusterSpace_i+1,clusterSpace_j],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i+1,clusterSpace_j]);
                            checkedSpaces += [clusterSpace_i+1,clusterSpace_j];
                            currentClusterSize++;
                        }
                    }
                    if ((clusterSpace_j+1) < gameBoard.length) {
                        if (gameBoard[clusterSpace_i][clusterSpace_j+1] == VILLAGE && !checkedSpaces.includes([clusterSpace_i,clusterSpace_j+1],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i,clusterSpace_j+1]);
                            checkedSpaces += [clusterSpace_i,clusterSpace_j+1];
                            currentClusterSize++;
                        }
                    }
                } //End of while loop
                if (currentClusterSize >= 6) {
                    playerPoints += 8;
                }
            }
        }
    }
}

/**
 * Earn three points for each distinct cluster of villages that is adjacent
 * to three or more different non-empty terrain types.
 * Note: Villages are not counted (they are part of the cluster!)
 * @param {*} gameBoard The board to score
 */
 function scoreCard_GreengoldPlains(gameBoard) {
    //This array holds the village spaces we have checked, to prevent double counting spaces as we are traversing the board space
    //by space and also exploring each village cluster.
    let checkedSpaces = [];
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == VILLAGE && !checkedSpaces.includes([i,j],0)) {
                //If we get here then we are in a new cluster.
                let currentClusterSpacesToCheck = [];
                currentClusterSpacesToCheck.push([i,j]);
                checkedSpaces += [i,j];
                let adjacentTypes = [];
                //Explore the village cluster to determine the different (non-empty) types it is adjacent to.
                while (currentClusterSpacesToCheck.length > 0) {
                    let clusterSpace = currentClusterSpacesToCheck.pop();
                    let clusterSpace_i = clusterSpace[0];
                    let clusterSpace_j = clusterSpace[1];
                    if ((clusterSpace_i-1) >= 0) {
                        let adjacentSpaceType = gameBoard[clusterSpace_i-1][clusterSpace_j];
                        if (adjacentSpaceType == VILLAGE && !checkedSpaces.includes([clusterSpace_i-1,clusterSpace_j],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i-1,clusterSpace_j]);
                            checkedSpaces += [clusterSpace_i-1,clusterSpace_j];
                        } else if (adjacentSpaceType != VILLAGE && adjacentSpaceType != EMPTY && !adjacentTypes.includes(adjacentSpaceType,0)) {
                            //This step is necessary so that we don't double count mountains. Claimed mountains are still just considered mountains.
                            if (adjacentSpaceType == MOUNTAIN_CLAIMED && !adjacentTypes.includes(MOUNTAIN,0)) {
                                adjacentTypes += MOUNTAIN;
                            } else {
                                adjacentTypes += adjacentSpaceType;
                            }
                        }
                    }
                    if ((clusterSpace_j-1) >= 0) {
                        let adjacentSpaceType = gameBoard[clusterSpace_i][clusterSpace_j-1];
                        if (gameBoard[clusterSpace_i][clusterSpace_j-1] == VILLAGE && !checkedSpaces.includes([clusterSpace_i,clusterSpace_j-1],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i,clusterSpace_j-1]);
                            checkedSpaces += [clusterSpace_i,clusterSpace_j-1];
                        } else if (adjacentSpaceType != VILLAGE && adjacentSpaceType != EMPTY && !adjacentTypes.includes(adjacentSpaceType,0)) {
                            if (adjacentSpaceType == MOUNTAIN_CLAIMED && !adjacentTypes.includes(MOUNTAIN,0)) {
                                adjacentTypes += MOUNTAIN;
                            } else {
                                adjacentTypes += adjacentSpaceType;
                            }
                        }
                    }
                    if ((clusterSpace_i+1) < gameBoard.length) {
                        let adjacentSpaceType = gameBoard[clusterSpace_i+1][clusterSpace_j];
                        if (gameBoard[clusterSpace_i+1][clusterSpace_j] == VILLAGE && !checkedSpaces.includes([clusterSpace_i+1,clusterSpace_j],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i+1,clusterSpace_j]);
                            checkedSpaces += [clusterSpace_i+1,clusterSpace_j];
                        } else if (adjacentSpaceType != VILLAGE && adjacentSpaceType != EMPTY && !adjacentTypes.includes(adjacentSpaceType,0)) {
                            if (adjacentSpaceType == MOUNTAIN_CLAIMED && !adjacentTypes.includes(MOUNTAIN,0)) {
                                adjacentTypes += MOUNTAIN;
                            } else {
                                adjacentTypes += adjacentSpaceType;
                            }
                        }
                    }
                    if ((clusterSpace_j+1) < gameBoard.length) {
                        let adjacentSpaceType = gameBoard[clusterSpace_i][clusterSpace_j+1];
                        if (gameBoard[clusterSpace_i][clusterSpace_j+1] == VILLAGE && !checkedSpaces.includes([clusterSpace_i,clusterSpace_j+1],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i,clusterSpace_j+1]);
                            checkedSpaces += [clusterSpace_i,clusterSpace_j+1];
                        } else if (adjacentSpaceType != VILLAGE && adjacentSpaceType != EMPTY && !adjacentTypes.includes(adjacentSpaceType,0)) {
                            if (adjacentSpaceType == MOUNTAIN_CLAIMED && !adjacentTypes.includes(MOUNTAIN,0)) {
                                adjacentTypes += MOUNTAIN;
                            } else {
                                adjacentTypes += adjacentSpaceType;
                            }
                        }
                    }
                } //End of while loop
                if (adjacentTypes.length >= 3) {
                    playerPoints += 3;
                }
            }
        }
    }
}

/**
 * Earn one point for each village space in the largest cluster of village
 * spaces that is not adjacent to a mountain space.
 * Note: Claimed mountains are still considered mountains.
 * @param {*} gameBoard The board to score
 */
 function scoreCard_GreatCity(gameBoard) {
    //This array holds the village spaces we have checked, to prevent double counting spaces as we are traversing the board space
    //by space and also exploring each village cluster.
    let checkedSpaces = [];
    let largestClusterSize = 0;
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] == VILLAGE && !checkedSpaces.includes([i,j],0)) {
                //If we get here then we are in a new cluster.
                let currentClusterSpacesToCheck = [];
                currentClusterSpacesToCheck.push([i,j]);
                checkedSpaces += [i,j];
                let currentClusterSize = 1;
                let adjacentToMountain = false;
                //Explore the village cluster to determine it's size (and if any of it's constituent spaces are adjacent to a mountain).
                while (currentClusterSpacesToCheck.length > 0) {
                    let clusterSpace = currentClusterSpacesToCheck.pop();
                    let clusterSpace_i = clusterSpace[0];
                    let clusterSpace_j = clusterSpace[1];
                    if ((clusterSpace_i-1) >= 0) {
                        if (gameBoard[clusterSpace_i-1][clusterSpace_j] == MOUNTAIN || gameBoard[clusterSpace_i-1][clusterSpace_j] == MOUNTAIN_CLAIMED) {
                            adjacentToMountain = true;
                        } else if (gameBoard[clusterSpace_i-1][clusterSpace_j] == VILLAGE && !checkedSpaces.includes([clusterSpace_i-1,clusterSpace_j],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i-1,clusterSpace_j]);
                            checkedSpaces += [clusterSpace_i-1,clusterSpace_j];
                            currentClusterSize++;
                        }
                    }
                    if ((clusterSpace_j-1) >= 0) {
                        if (gameBoard[clusterSpace_i][clusterSpace_j-1] == MOUNTAIN || gameBoard[clusterSpace_i][clusterSpace_j-1] == MOUNTAIN_CLAIMED) {
                            adjacentToMountain = true;
                        } else if (gameBoard[clusterSpace_i][clusterSpace_j-1] == VILLAGE && !checkedSpaces.includes([clusterSpace_i,clusterSpace_j-1],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i,clusterSpace_j-1]);
                            checkedSpaces += [clusterSpace_i,clusterSpace_j-1];
                            currentClusterSize++;
                        }
                    }
                    if ((clusterSpace_i+1) < gameBoard.length) {
                        if (gameBoard[clusterSpace_i+1][clusterSpace_j] == MOUNTAIN || gameBoard[clusterSpace_i+1][clusterSpace_j] == MOUNTAIN_CLAIMED) {
                            adjacentToMountain = true;
                        } else if (gameBoard[clusterSpace_i+1][clusterSpace_j] == VILLAGE && !checkedSpaces.includes([clusterSpace_i+1,clusterSpace_j],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i+1,clusterSpace_j]);
                            checkedSpaces += [clusterSpace_i+1,clusterSpace_j];
                            currentClusterSize++;
                        }
                    }
                    if ((clusterSpace_j+1) < gameBoard.length) {
                        if (gameBoard[clusterSpace_i][clusterSpace_j+1] == MOUNTAIN || gameBoard[clusterSpace_i][clusterSpace_j+1] == MOUNTAIN_CLAIMED) {
                            adjacentToMountain = true;
                        } else if (gameBoard[clusterSpace_i][clusterSpace_j+1] == VILLAGE && !checkedSpaces.includes([clusterSpace_i,clusterSpace_j+1],0)) {
                            currentClusterSpacesToCheck.push([clusterSpace_i,clusterSpace_j+1]);
                            checkedSpaces += [clusterSpace_i,clusterSpace_j+1];
                            currentClusterSize++;
                        }
                    }
                } //End of while loop
                if (!adjacentToMountain && currentClusterSize > largestClusterSize) {
                    largestClusterSize = currentClusterSize;
                }
            }
        }
    } //End of outermost for loop
    playerPoints += largestClusterSize;
}