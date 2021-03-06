"use strict";

/** Enumerated constant that represents an empty space on the game board. */
const EMPTY = 0;
/** Enumerated constant that represents a mountain space on the game board with a coin. */
const MOUNTAIN = 1;
/** Enumerated constant that represents a blocked space on the game board. */
const BLOCKED = 2;
/** Enumerated constant that represents a farm space on the game board. */
const FARM = 3;
/** Enumerated constant that represents a forest space on the game board. */
const FOREST = 4;
/** Enumerated constant that represents a village space on the game board. */
const VILLAGE = 5;
/** Enumerated constant that represents a river space on the game board. */
const RIVER = 6;
/** Enumerated constant that represents an enemy space on the game board. */
const ENEMY = 7;
/** Enumerated constant that represents an overlap space on the game board. Only used for tempGameBoard. */
const OVERLAP = 8;
/** Enumerated constant that represents a mountain space on the game board with no coin. */
const MOUNTAIN_CLAIMED = 9;

/** Global variable that holds the state of the game board after the previous piece was placed. */
var gameBoard;
/** Global variable that holds the total points the player has scored this game. */
var playerPoints;
/** Global variable that holds the total coins the player has gained this game. */
var playerCoins;
/** Global variable that holds the score cards. The order determines which season they are scored in. */
var scoreCards;
/** Global variable that holds the explore deck, which determines what piece the player will be placing next. */
var exploreDeck;
/** Global variable that holds the ambush cards, which determines the negative cards the player will encounter. */
var ambushCards;
/** Global variable that holds the piece that the player is currently placing. */
var currentPiece;
/** Global variable that holds a value between 0 and 3, which is used to determine when the game is over (when 3 seasons have been scored). */
var seasonsScored;
/** Global variable that holds a value which is reduced whenever a piece is placed. When it reaches zero, the current season is scored and the next season begins. */
var cardsThisSeason;
/** Global array that holds the locations of all the unclaimed mountains on the gameboard. */
var unclaimedMountains = [];
/** Global variable that holds the pseudo-random number generator. */
var rand;


/**
 * This function allows the player to interact with the game with arrow keys, 'r', 'f', and 'Enter'.
 * If a currentPiece has been assigned, the arrow keys move the currentPiece left, right, up, and down
 * on the board, the 'r' key rotates the piece 90 degrees clockwise, the 'f' key flips the piece 
 * across the x-axis, and the 'Enter' key will place the piece if it can legally be placed where it is.
 * After any of these transformations, we check that the piece has not left the bounds of the game board,
 * and if it has then we translate it back onto the game board.
 * @param {*} e The key that was pressed.
 */
document.onkeydown = function(e) {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        switch (e.key) {
            case "ArrowLeft":
                currentPiece.location[1]--;
                break;
            case "ArrowRight":
                currentPiece.location[1]++;
                break;
            case "ArrowUp":
                currentPiece.location[0]--;
                break;
            case "ArrowDown":
                currentPiece.location[0]++;
                break;
            case 'r':
                rotatePiece(currentPiece);
                break;
            case 'f':
                flipPiece(currentPiece);     
                break;
            case 't':
                swapPieceType(currentPiece);
                break;
            case "Enter":
                if (successfullyPlacedPiece(currentPiece)) {
                    checkIfSeasonOver();
                }
                break;
        }
        //If 3 seasons have been scored then the game is over and we don't need to call these functions
        if (seasonsScored < 3) {
            checkCurrentPieceLegallyPlaced();
            renderPiece(currentPiece);
        }
    }
};

/**
 * Onload handler for game page and leaderboard page.
 * Game page: When the game page has finished loading, start the game!
 * Leaderboard page: When the leaderboard page has finished loading, initialize the date form with the current date
 * @param {*} event 
 */
window.onload = (event) => {
    if (window.location.pathname == "/game/daily" || window.location.pathname == "/game/freeplay" || window.location.pathname == "/game/test") {
        startGame();
    } 
    else if (window.location.pathname == "/leaderboard") {
        document.getElementById("leaderboard_daily_date").value = getDate();
        postDate();
    } 
};

/**
 * The function called when the player presses the "Move Left" button.
 */
function buttonMoveLeft() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        currentPiece.location[1]--;
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * The function called when the player presses the "Move Right" button.
 */
function buttonMoveRight() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        currentPiece.location[1]++;
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * The function called when the player presses the "Move Up" button.
 */
function buttonMoveUp() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        currentPiece.location[0]--;
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * The function called when the player presses the "Move Down" button.
 */
function buttonMoveDown() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        currentPiece.location[0]++;
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * The function called when the player presses the "Rotate" button.
 */
function buttonRotate() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        rotatePiece(currentPiece);
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * The function called when the player presses the "Flip" button.
 */
function buttonFlip() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        flipPiece(currentPiece);
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * The function called when the player presses the "Swap Type" button.
 */
function buttonSwapType() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        swapPieceType(currentPiece);
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * The function called when the player presses the "Place Piece" button.
 */
function buttonPlacePiece() {
    if (typeof currentPiece != 'undefined' && currentPiece.toString() != "") {
        if (successfullyPlacedPiece(currentPiece)) {
            checkIfSeasonOver();
        }
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
}

/**
 * Turns a given string into a seed (via a hash function) that can be used in a pseudo-RNG.
 * See here for reference: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 * @param {*} str The input string to be turned into a seed
 * @returns A 32-bit hash that can be used to seed a pseudo-RNG
 */
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

/**
 * This function takes a given seed and returns a pseudo-random number generator with that seed.
 * See here for reference: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 * @param {*} a The seed to use in the pseudo-RNG
 * @returns A pseudo-RNG function with the given seed
 */
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * Starts a new game by initialising and rendering the game board, player points, score cards, 
 * and explore deck, and revealing the top card of the explore deck to the player.
 * The pathname determines if the game is started with the daily seed or a random freeplay seed.
 */
function startGame() {
    //Initialize the date for the purpose of setting the pseudo-random number generator's seed.
    let currentDate = new Date();

    //Set the seed for the pseudo-random number generator to the current time (milliseconds since Jan 1, 1970).
    let seed = xmur3(currentDate.getTime().toString());

    //If this is a daily game, overwrite the seed for the pseudo-random number generator with the current date (from the server).
    if (window.location.pathname == "/game/daily") {
        let serverDate = getDate();
        seed = xmur3(serverDate);
    }

    if (window.location.pathname == "/game/test") {
        //This seed is set for the purposes of testing. Games completed on this pathname don't have a score posted.
        seed = xmur3("testseed");
    }

    //Initialize the pseudo-random number generator with the given seed.
    rand = mulberry32(seed());
    
    //The gameContents are hidden by default because all /game/<n> links are valid (don't throw 404 error) but we only want to show
    //the game for valid links eg. /game/daily, /game/freeplay, and /game/test.
    document.getElementById("gameContents").style.display = 'block';

    gameBoard = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];

    initializeGameBoard();

    renderBoard(gameBoard);

    playerPoints = 0;
    renderPlayerPoints();

    playerCoins = 0;
    renderPlayerCoins();

    seasonsScored = 0;
    initializeScoreCards();
    for (let card = 1; card < scoreCards.length+1; card++) {
        document.getElementById("scoreCard" + card).innerHTML = scoreCards[card-1].name; 
        document.getElementById("scoreCardDescription" + card).innerHTML = scoreCards[card-1].description;
        switch (scoreCards[card-1].type) {
            case "Forest":
                document.getElementById("scoreCard" + card).style.background = 'green';
                document.getElementById("scoreCardDescription" + card).style.background = 'green';
                break;
            case "FarmRiver":
                document.getElementById("scoreCard" + card).style.background = 'linear-gradient(to right, yellow 0%, blue 100%';
                document.getElementById("scoreCardDescription" + card).style.background = 'linear-gradient(to right, yellow 0%, blue 100%';
                break;
            case "Village":
                document.getElementById("scoreCard" + card).style.background = 'red';
                document.getElementById("scoreCardDescription" + card).style.background = 'red';
                break;
            case "Placement":
                document.getElementById("scoreCard" + card).style.background = 'grey';  
                document.getElementById("scoreCardDescription" + card).style.background = 'grey';  
                break;
        }
    }

    indicateActiveSeason();
    initializeAmbushCards();
    initializeExploreDeck();
    determineNumberOfCardsThisSeason();
    currentPiece = exploreDeck.pop();
    checkCurrentPieceCanBePlaced();
    renderPiece(currentPiece);
}

/**
 * Initializes the game board with 2 mountains and 4 blocked spaces.
 * First a mountain is placed on a random space that is 1 away from the edge of the game board.
 * Then a second mountain is placed on a space that is 2 away from the edge of the game board and at least
 * 4 spaces away vertically or horizontally from the first mountain.
 * Lastly, 3 blocked spaces are placed on random locations that aren't cardinally adjacent to either of the mountains.
 */
function initializeGameBoard() {
    //(x1,y1) represents the position of the first mountain, (x2,y2) represents the position of the second mountain.
    let x1, y1, x2, y2;
    //Determine the axis which the first mountain will be placed along.
    if (rand() <= 0.5) {
        //x1 is randomly either 1 or 6
        x1 = 5 * Math.round(rand()) + 1;
        //y1 is random from 1 to 6
        y1 = Math.round(5 * rand() + 1);
    } else {
        //x1 is random from 1 to 6
        x1 = Math.round(5 * rand() + 1);
        //y1 is randomly either 1 or 6
        y1 = 5 * Math.round(rand()) + 1; 
    }
    gameBoard[x1][y1] = MOUNTAIN;
    unclaimedMountains.push([x1,y1]);
    let adjacentToMountain = [[x1,y1], [x1+1,y1], [x1-1,y1], [x1,y1+1], [x1,y1-1]];
    //Determine the position of the second mountain.
    if (x1 == 1) {
        x2 = 5;
        y2 = Math.round(3 * rand() + 2);
    } else if (x1 == 6) {
        x2 = 2;
        y2 = Math.round(3 * rand() + 2);
    } else if (y1 == 1) {
        x2 = Math.round(3 * rand() + 2);
        y2 = 5;
    } else if (y1 == 6) {
        x2 = Math.round(3 * rand() + 2);
        y2 = 2;
    }
    gameBoard[x2][y2] = MOUNTAIN;
    unclaimedMountains.push([x2,y2]);
    adjacentToMountain += [[x2,y2], [x2+1,y2], [x2-1,y2], [x2,y2+1], [x2,y2-1]];
    //Randomly place the blocked spaces.
    let blockedPlaced = 0;
    while (blockedPlaced < 3) {
        let xb = Math.round(7 * rand());
        let yb = Math.round(7 * rand());
        if (adjacentToMountain.includes([xb,yb],0) || gameBoard[xb][yb] == BLOCKED) {
            //Cannot place blocked piece adjacent to a mountain or over the top of another blocked piece
            continue;
        } else {
            gameBoard[xb][yb] = BLOCKED;
            blockedPlaced++;
        }
    }
}

/**
 * Renders the given game board on the game_page. The board is stored in a html table on the game_page.
 * The style ensures the cells of the table are fully coloured and have an icon if necessary.
 * @param {*} board The board to render
 */
function renderBoard(board) {
    for (let i = 0; i < board.length; i++) {
        //Convert each board row from (eg.) "0,0,0,0,0,0,0,0" to "00000000". We remove everything that isn't 0-9 (the values of the enumerated constants).
        let gameBoardRow = board[i].toString().replace(/[^0-9]/g,""); 
        let colourBoard = "";
        for (let j = 0; j < gameBoardRow.length; j++) {
            let c = gameBoardRow.charAt(j);
            switch (parseInt(c)) {
                case EMPTY:
                    colourBoard += "<td style=\"color:white;background-color:white;\"></td>";
                    break;
                case MOUNTAIN:
                    colourBoard += "<td style=\"color:brown;background-color:brown;outline:solid black thin;\" name=\"mountain\"><img src='/static/images/MountainIcon.png' alt='mountain' class='gameboard_icon'></td>";
                    break;
                case BLOCKED:
                    colourBoard += "<td style=\"color:black;background-color:black;outline:solid black thin;\" name=\"blocked\"></td>";
                    break;
                case FARM:
                    colourBoard += "<td style=\"color:yellow;background-color:yellow;outline:solid black thin;\" name=\"farm\"><img src='/static/images/FarmIcon.png' alt='farm' class='gameboard_icon'></td>";
                    break;
                case FOREST:
                    colourBoard += "<td style=\"color:green;background-color:green;outline:solid black thin;\" name=\"forest\"><img src='/static/images/ForestIcon.png' alt='forest' class='gameboard_icon'></td>";
                    break;
                case VILLAGE:
                    colourBoard += "<td style=\"color:red;background-color:red;outline:solid black thin;\" name=\"village\"><img src='/static/images/VillageIcon.png' alt='village' class='gameboard_icon'></td>";
                    break;
                case RIVER:
                    colourBoard += "<td style=\"color:blue;background-color:blue;outline:solid black thin;\" name=\"river\"><img src='/static/images/RiverIcon.png' alt='river' class='gameboard_icon'></td>";
                    break;
                case ENEMY:
                    colourBoard += "<td style=\"color:purple;background-color:purple;outline:solid black thin;\" name=\"enemy\"><img src='/static/images/EnemyIcon.png' alt='enemy' class='gameboard_icon'></td>";
                    break;
                case OVERLAP:
                    colourBoard += "<td style=\"color:orange;background-color:orange;outline:solid black thin;\" name=\"overlap\"><img src='/static/images/OverlapIcon.png' alt='overlap' class='gameboard_icon'></td>";
                    break;
                case MOUNTAIN_CLAIMED:
                    colourBoard += "<td style=\"color:gray;background-color:gray;outline:solid black thin;\" name=\"claimed_mountain\"><img src='/static/images/MountainClaimedIcon.png' alt='claimed mountain' class='gameboard_icon'></td>";
                    break;
            }
        }
        //game_page.html stores the game board in a table which has rows with id from boardRow0 to boardRow7
        let boardRender = document.getElementById("boardRow"+i);
        boardRender.innerHTML = colourBoard;
    }
}

/**
 * Update game_page.html to display the player's current points.
 */
 function renderPlayerPoints() {
    let points = document.getElementById("playerPoints");
    points.innerHTML = "Points: " + playerPoints;
}

/**
 * Update game_page.html to display the player's current coins.
 */
 function renderPlayerCoins() {
    let points = document.getElementById("playerCoins");
    points.innerHTML = "Coins: " + playerCoins;
}

/**
 * Select the score cards for this game and randomize their order.
 */
function initializeScoreCards() {
    //Randomly select a score card for each type.
    let forestScoreCard = shuffle(getForestScoreCards()).pop();
    let farmRiverScoreCard = shuffle(getFarmRiverScoreCards()).pop();
    let villageScoreCard = shuffle(getVillageScoreCards()).pop();
    let placementScoreCard = shuffle(getPlacementScoreCards()).pop();

    //Randomly decide the order in which the score cards will be scored.
    scoreCards = [forestScoreCard, farmRiverScoreCard, villageScoreCard];
    shuffle(scoreCards);

    //Add the placement score card last because it is always scored at the end of the third season.
    scoreCards.push(placementScoreCard);
}

/**
 * Looks at the explore deck and determines, based on the season, the number of cards that will be drawn this season.
 * The first season has a time total of 6, the second season has a time total of 5, and the third season has a time total of 4.
 */
function determineNumberOfCardsThisSeason() {
    let seasonTimeTotal = 6 - seasonsScored;
    let numberOfCards = 1;
    let determinedNumberOfCards = false;
    while (!determinedNumberOfCards) {
        let totalTimeOfCards = 0;
        for (let i = 1; i <= numberOfCards; i++) {
            totalTimeOfCards += exploreDeck[exploreDeck.length - i].time;
        }
        if (totalTimeOfCards >= seasonTimeTotal) {
            determinedNumberOfCards = true;
            cardsThisSeason = numberOfCards;
            document.getElementById("cardsRemaining1").innerHTML = "";
            document.getElementById("cardsRemaining2").innerHTML = "";
            document.getElementById("cardsRemaining3").innerHTML = "";
            document.getElementById("cardsRemaining" + (seasonsScored + 1)).innerHTML = "Cards remaining: " + cardsThisSeason;
        }
        numberOfCards++;
    }
}

/**
 * Colour the "Season n" labels to indicate which seasons have been scored and which season is the current season.
 * The current season is underlined, and scored seasons are coloured grey.
 */
function indicateActiveSeason() {
    for (let i = 1; i <= seasonsScored; i++) {
        document.getElementById("season" + i).style.color = "grey";
        document.getElementById("season" + i).style.textDecoration = "";
    }
    if (seasonsScored < 3) {
        document.getElementById("season" + (seasonsScored + 1)).style.textDecoration = "underline";
    }   
}

/**
 * Create the set of ambush cards by adding the 4 base cards and shuffling.
 */
function initializeAmbushCards() {
    ambushCards = [];
    ambushCards.push({type:ENEMY, shape:[[0,0],[1,1],[2,2]],       time:0, location:[0,0]});
    ambushCards.push({type:ENEMY, shape:[[0,0],[1,0],[2,0],[1,1]], time:0, location:[0,4]});
    ambushCards.push({type:ENEMY, shape:[[0,0],[1,0],[0,2],[1,2]], time:0, location:[4,0]});
    ambushCards.push({type:ENEMY, shape:[[0,0],[1,0],[1,1],[2,1]], time:0, location:[4,4]});
    shuffle(ambushCards);
}

/**
 * Create the explore deck by adding the 10 base cards and shuffling.
 */
function initializeExploreDeck() {
    exploreDeck = [];
    exploreDeck.push({type:FOREST,  shape:[[0,0],[0,1],[1,1],[-1,0],[-2,0]],   altType:VILLAGE,               alt:"type",  coin:false, time:2, location:[4,4]});
    exploreDeck.push({type:FARM,    shape:[[0,0],[1,0],[-1,0],[0,1],[0,-1]],   altShape:[[0,0],[0,1]],        alt:"shape", coin:false, time:1, location:[4,4]});
    exploreDeck.push({type:FOREST,  shape:[[0,0],[-1,0],[1,0],[1,1]],          altShape:[[0,0],[1,1]],        alt:"shape", coin:false, time:1, location:[4,4]});
    exploreDeck.push({type:FOREST,  shape:[[0,0],[0,1],[0,2],[-1,0]],          altType:FARM,                  alt:"type",  coin:false, time:2, location:[4,4]});
    exploreDeck.push({type:VILLAGE, shape:[[0,0],[1,0],[-1,0],[-1,-1],[0,-1]], altShape:[[0,0],[1,0],[0,-1]], alt:"shape", coin:false, time:1, location:[4,4]});
    exploreDeck.push({type:VILLAGE, shape:[[0,0],[-1,0],[1,0],[0,-1]],         altType:FARM,                  alt:"type",  coin:false, time:2, location:[4,4]});
    exploreDeck.push({type:FARM,    shape:[[0,0],[1,0],[2,0],[0,1],[0,2]],     altType:RIVER,                 alt:"type",  coin:false, time:2, location:[4,4]});
    exploreDeck.push({type:RIVER,   shape:[[0,0],[1,0],[1,1],[0,-1],[-1,-1]],  altShape:[[0,0],[-1,0],[1,0]], alt:"shape", coin:false, time:1, location:[4,4]});
    exploreDeck.push({type:FOREST,  shape:[[0,0],[1,0],[-1,0],[1,1],[1,-1]],   altType:RIVER,                 alt:"type",  coin:false, time:2, location:[4,4]});
    exploreDeck.push({type:RIVER,   shape:[[0,0],[1,0],[2,0],[3,0]],           altType:VILLAGE,               alt:"type",  coin:false, time:2, location:[4,4]});
    exploreDeck.push({type:FARM,    shape:[[0,0]],                             altType:FOREST,                alt:"rift",  coin:false, time:0, location:[4,4]});
    //Add an ambush card to the explore deck
    exploreDeck.push(ambushCards.pop());
    shuffle(exploreDeck);
}

/**
 * Check if the current piece can be placed on the game board.
 * If the piece cannot legally be placed anywhere then we reduce the piece to a 1x1 block.
 */
function checkCurrentPieceCanBePlaced() {
    if (currentPiece.type == ENEMY) {
        placeAmbushCard();
    }
    let ableToBePlaced_default = false;
    let ableToBePlaced_alt = false;
    //Check each position on the game board
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            //If the location of the primary block isn't empty then regardless of rotation / flipping the piece cannot be placed
            if (gameBoard[i][j] != EMPTY) {
                continue;
            }
            //Check each possible rotation of the current piece
            for (let rotation = 0; rotation < 4; rotation++) {
                let pieceCanBePlaced = true;
                let pieceCanBePlaced_flipped = true;
                let altPieceCanBePlaced = false;
                let altPieceCanBePlaced_flipped = false;
                if (currentPiece.alt == "shape") {
                    altPieceCanBePlaced = true;
                    altPieceCanBePlaced_flipped = true;
                }
                rotatePiece(currentPiece);
                for (let blockNumber = 0; blockNumber < currentPiece.shape.length; blockNumber++) {
                    let x_coord_block = currentPiece.shape[blockNumber][1] + j;
                    let y_coord_block = currentPiece.shape[blockNumber][0] + i;
                    if (x_coord_block < 0 || y_coord_block < 0 || x_coord_block >= gameBoard.length || y_coord_block >= gameBoard.length 
                        || gameBoard[y_coord_block][x_coord_block] != EMPTY) {
                        pieceCanBePlaced = false;
                    }
                }
                if (currentPiece.alt == "shape") {
                    for (let blockNumber = 0; blockNumber < currentPiece.altShape.length; blockNumber++) {
                        let x_coord_block = currentPiece.altShape[blockNumber][1] + j;
                        let y_coord_block = currentPiece.altShape[blockNumber][0] + i;
                        if (x_coord_block < 0 || y_coord_block < 0 || x_coord_block >= gameBoard.length || y_coord_block >= gameBoard.length 
                            || gameBoard[y_coord_block][x_coord_block] != EMPTY) {
                            altPieceCanBePlaced = false;
                        }
                    }
                }
                //Check if flipping the piece allows the piece to be placed
                if (!pieceCanBePlaced || (currentPiece.alt == "shape" && !altPieceCanBePlaced)) {
                    flipPiece(currentPiece);
                    for (let blockNumber = 0; blockNumber < currentPiece.shape.length; blockNumber++) {
                        let x_coord_block = currentPiece.shape[blockNumber][1] + j;
                        let y_coord_block = currentPiece.shape[blockNumber][0] + i;
                        if (x_coord_block < 0 || y_coord_block < 0 || x_coord_block >= gameBoard.length || y_coord_block >= gameBoard.length 
                            || gameBoard[y_coord_block][x_coord_block] != EMPTY) {
                            pieceCanBePlaced_flipped = false;
                        }
                    }
                    if (currentPiece.alt == "shape") {
                        for (let blockNumber = 0; blockNumber < currentPiece.altShape.length; blockNumber++) {
                            let x_coord_block = currentPiece.altShape[blockNumber][1] + j;
                            let y_coord_block = currentPiece.altShape[blockNumber][0] + i;
                            if (x_coord_block < 0 || y_coord_block < 0 || x_coord_block >= gameBoard.length || y_coord_block >= gameBoard.length 
                                || gameBoard[y_coord_block][x_coord_block] != EMPTY) {
                                altPieceCanBePlaced_flipped = false;
                            }
                        }
                    }
                    //Flip the piece back to it's original orientation
                    flipPiece(currentPiece);
                }
                if (pieceCanBePlaced || pieceCanBePlaced_flipped) {
                    ableToBePlaced_default = true;
                }
                if (altPieceCanBePlaced || altPieceCanBePlaced_flipped) {
                    ableToBePlaced_alt = true;
                }
            }
        }
    }
    if (!ableToBePlaced_default && ableToBePlaced_alt) {
        //can only use altShape, which always grants a coin
        currentPiece.shape = currentPiece.altShape;
        currentPiece.coin = true;
    } else if (ableToBePlaced_default && !ableToBePlaced_alt) {
        if (currentPiece.alt == "shape") {
            //can only use defaultShape, which never grants a coin
            currentPiece.altShape = currentPiece.shape;
            currentPiece.coin = false;
        }
    } else if (!ableToBePlaced_default && !ableToBePlaced_alt) {
        //cannot use altShape or defaultShape so player can only place a 1x1 square which never grants a coin
        currentPiece.shape = [[0,0]];
        if (currentPiece.alt == "shape") {
            currentPiece.altShape = currentPiece.shape;
        }
        currentPiece.coin = false;
    }
}

/**
 * Check that the current piece is wholly contained within the bounds of the game board.
 * If any blocks of the piece are outside the bounds of the game board then move the piece
 * back onto the game board until it is wholly contained within the bounds.
 */
function checkCurrentPieceLegallyPlaced() {
    let allBlocksLegal = false;
    while (!allBlocksLegal) {
        for (let blockNumber = 0; blockNumber < currentPiece.shape.length; blockNumber++) {
            let x_coord_block = currentPiece.shape[blockNumber][1] + currentPiece.location[1];
            let y_coord_block = currentPiece.shape[blockNumber][0] + currentPiece.location[0];
            if (x_coord_block < 0) {
                currentPiece.location[1]++;
                //The for loop is broken after each translation to prevent the block being moved back (for example) 3 spaces
                //if it had 3 blocks out of bounds but the piece would be within the bounds after 1 translation.
                continue;
            }
            if (x_coord_block >= gameBoard.length) {
                currentPiece.location[1]--;
                continue;
            }
            if (y_coord_block < 0) {
                currentPiece.location[0]++;
                continue;
            }
            if (y_coord_block >= gameBoard.length) {
                currentPiece.location[0]--;
                continue;
            }
        }
        allBlocksLegal = true;
    }
}

/**
 * Places the current ambush card on the board if possible without rotating or flipping the piece.
 * If the piece cannot be placed then the card is ignored.
 */
function placeAmbushCard () {
    let placedAmbushCard = false;
    if (successfullyPlacedPiece(currentPiece)) {
        placedAmbushCard = true;
        checkIfSeasonOver();
    }
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (placedAmbushCard) {
                break;
            }
            currentPiece.location[0] = (currentPiece.location[0] + 1) % gameBoard.length;
            if (successfullyPlacedPiece(currentPiece)) {
                placedAmbushCard = true;
                checkIfSeasonOver();
            }
        }
        if (placedAmbushCard) {
            break;
        }
        currentPiece.location[1] = (currentPiece.location[1] + 1) % gameBoard.length;
        if (successfullyPlacedPiece(currentPiece)) {
            placedAmbushCard = true;
            checkIfSeasonOver();
        }
    }
    if (!placedAmbushCard) {
        cardsThisSeason--;
        //Clear the innerHTML of the cardsRemaining elements so that you only see a number for the season you are currently in
        document.getElementById("cardsRemaining1").innerHTML = "";
        document.getElementById("cardsRemaining2").innerHTML = "";
        document.getElementById("cardsRemaining3").innerHTML = "";
        document.getElementById("cardsRemaining" + (seasonsScored + 1)).innerHTML = "Cards remaining: " + cardsThisSeason;
    
        currentPiece = exploreDeck.pop();
        checkCurrentPieceCanBePlaced();
        renderPiece(currentPiece);
    }
}

/**
 * Renders the location of the given piece on the current game board without altering the current (stored) game board.
 * @param {*} piece The piece to render
 */
function renderPiece(piece) {
    //We don't want to manipulate the original game board so we create a copy
    let tempBoard = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    copyBoard(tempBoard, gameBoard);
    let type = piece.type;
    let shape = piece.shape;
    let x_coord = piece.location[0];
    let y_coord = piece.location[1];
    for (let blockNumber = 0; blockNumber < shape.length; blockNumber++) {
        let x_coord_block = shape[blockNumber][0] + x_coord;
        let y_coord_block = shape[blockNumber][1] + y_coord;
        if (0 <= x_coord_block && x_coord_block < tempBoard.length && 0 <= y_coord_block && y_coord_block < tempBoard.length) {
            if (tempBoard[x_coord_block][y_coord_block] == EMPTY) {
                tempBoard[x_coord_block][y_coord_block] = type;
            } else {
                tempBoard[x_coord_block][y_coord_block] = OVERLAP;
            }
        }
    }
    renderBoard(tempBoard);
    document.getElementById("pieceCoin").innerHTML = "You will gain a coin: " + piece.coin;
}

/**
 * Rotates the given piece 90 degrees clockwise about the primary block.
 * @param {*} piece The piece to rotate
 */
function rotatePiece(piece) {
    let shape = piece.shape;
    for (let blockNumber = 0; blockNumber < shape.length; blockNumber++) {
        let temp = shape[blockNumber][1];
        shape[blockNumber][1] = -shape[blockNumber][0];
        shape[blockNumber][0] = temp;
    }
    //We want to avoid flipping twice in situations where the alt shape is the same as the default shape
    if (piece.alt == "shape" && piece.altShape != piece.shape) {
        let altShape = piece.altShape;
        for (let blockNumber = 0; blockNumber < altShape.length; blockNumber++) {
            let temp = altShape[blockNumber][1];
            altShape[blockNumber][1] = -altShape[blockNumber][0];
            altShape[blockNumber][0] = temp;
        }
    }
}

/**
 * Flips the given piece across the x-axis, which is defined by the primary block.
 * @param {*} piece The piece to flip
 */
function flipPiece(piece) {
    let shape = piece.shape;
    for (let blockNumber = 0; blockNumber < shape.length; blockNumber++) {
        shape[blockNumber][0] *= -1;
    }
    //We want to avoid flipping twice in situations where the alt shape is the same as the default shape
    if (piece.alt == "shape" && piece.altShape != piece.shape) {
        let altShape = piece.altShape;
        for (let blockNumber = 0; blockNumber < altShape.length; blockNumber++) {
            altShape[blockNumber][0] *= -1;
        }
    }
}

/**
 * Swaps the piece type, which either means the shape of the piece is changed or it's terrain type is changed.
 * @param {*} piece The piece which will have it's type swapped
 */
function swapPieceType(piece) {
    if (piece.alt == "shape") {
        //If shape and altShape are the same then the ability for the piece to grant a coin has been determined in 
        //checkCurrentPieceCanBePlaced(), and shouldn't be changed
        if (piece.shape != piece.altShape) {
            let temp = piece.altShape;
            piece.altShape = piece.shape;
            piece.shape = temp;
            //Only pieces that change shape can grant coins. Only their starting alternative shape grants a coin.
            piece.coin = !piece.coin;
        }
    } else if (piece.alt == "type") {
        let temp = piece.altType;
        piece.altType = piece.type;
        piece.type = temp;
    } else if (piece.alt == "rift") {
        let temp = piece.altType;
        //For rift pieces, the type moves through FARM (3), FOREST (4), VILLAGE (5), and RIVER (6), then cycles
        piece.altType = (piece.altType - 2) % 4 + 3;
        piece.type = temp;
    }
}

/**
 * Populates the values of the copy board with the corresponding values from the original board.
 * @param {*} copy The board which will become a copy of the original
 * @param {*} original The board which will be copied
 */
function copyBoard(copy, original) {
    for (let i = 0; i < original.length; i++) {
        for (let j = 0; j < original[0].length; j++) {
            copy[i][j] = original[i][j];
        }
    }
}

/**
 * Attempts to place the given piece on the current game board. If the current piece is found to overlap
 * any existing pieces or if any of it's blocks are placed outside the bounds of the game board then the piece
 * is not placed.
 * @param {*} piece The piece to be placed
 * @returns True if the piece was successfully placed on the game board, false otherwise
 */
 function successfullyPlacedPiece(piece) {
    //We don't want to manipulate the original game board so we create a copy
    let tempBoard = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    copyBoard(tempBoard, gameBoard);
    let type = piece.type;
    let shape = piece.shape;
    let x_coord = piece.location[0];
    let y_coord = piece.location[1];
    //Attempt to place the piece on the temporary game board
    for (let blockNumber = 0; blockNumber < shape.length; blockNumber++) {
        let x_coord_block = shape[blockNumber][0] + x_coord;
        let y_coord_block = shape[blockNumber][1] + y_coord;
        if (0 <= x_coord_block && x_coord_block < tempBoard.length && 0 <= y_coord_block && y_coord_block < tempBoard.length) {
            if (tempBoard[x_coord_block][y_coord_block] == EMPTY) {
                tempBoard[x_coord_block][y_coord_block] = type;
            } else {
                //The piece would be placed on top of a non-empty space
                return false;
            }
        } else {
            //The piece would be placed off of the board
            return false;
        }
    }
    //If we got here then the piece has been legally placed on the temporary board so we make that the new game board
    copyBoard(gameBoard, tempBoard);
    checkIfMountainsClaimed();
    renderBoard(gameBoard);
    if (piece.coin) {
        playerCoins++;
    }
    renderPlayerCoins();
    //A piece has been placed so we decrement the number of explore cards (pieces) remaining until we score this season
    cardsThisSeason--;
    document.getElementById("cardsRemaining1").innerHTML = "";
    document.getElementById("cardsRemaining2").innerHTML = "";
    document.getElementById("cardsRemaining3").innerHTML = "";
    document.getElementById("cardsRemaining" + (seasonsScored + 1)).innerHTML = "Cards remaining: " + cardsThisSeason;
    return true;
}

/**
 * Check if any mountains on the gameboard have been claimed.
 * A mountain is claimed when all cardinally adjacent squares are filled.
 * Claiming a mountain grants the player 1 coin.
 */
function checkIfMountainsClaimed() {
    if (unclaimedMountains.length != 0) {
        for (let mtn = 0; mtn < unclaimedMountains.length; mtn++) {
            let mountain_x = unclaimedMountains[mtn][0];
            let mountain_y = unclaimedMountains[mtn][1];
            if (gameBoard[mountain_x-1][mountain_y] != EMPTY && gameBoard[mountain_x+1][mountain_y] != EMPTY &&
                gameBoard[mountain_x][mountain_y-1] != EMPTY && gameBoard[mountain_x][mountain_y+1] != EMPTY) {
                    gameBoard[mountain_x][mountain_y] = MOUNTAIN_CLAIMED;
                    playerCoins++;
                    unclaimedMountains.splice(mtn,mtn+1);
                }

        }
    }
}

/**
 * Check if the season is over. This function is called after a piece has been placed successfully. 
 * The season is over when there are no explore cards remaining this season.
 * If the season is over then we score the current score card, render the player's new total points, then check if we
 * have scored 3 seasons (in which case the game is over).
 * Otherwise, if the season is not over, we reveal the next card on the explore deck and this season continues.
 */
function checkIfSeasonOver() {
    if (cardsThisSeason != 0) {
        currentPiece = exploreDeck.pop();
        checkCurrentPieceCanBePlaced();
        renderPiece(currentPiece);
    } else {
        scoreCards[seasonsScored].function(gameBoard);
        playerPoints += playerCoins;
        losePointsFromEnemySpaces();
        seasonsScored++;
        if (seasonsScored == 3) {
            //Score the placement score card
            scoreCards[seasonsScored].function(gameBoard);
        }
        renderPlayerPoints();
        indicateActiveSeason();
        checkIfGameOver();
    }
}

/**
 * For each enemy space on the game board, lose 1 point for each empty space that is cardinally adjacent
 * to at least one enemy space.
 */
function losePointsFromEnemySpaces() {
    let adjacentToEnemySpace = [];
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] != ENEMY) {
                continue;
            }
            if ((i-1) >= 0) {
                if (gameBoard[i-1][j] == EMPTY && !adjacentToEnemySpace.includes([i-1,j],0)) {
                    playerPoints--;
                    adjacentToEnemySpace += [i-1,j];
                }
            } 
            if ((j-1) >= 0) {
                if (gameBoard[i][j-1] == EMPTY && !adjacentToEnemySpace.includes([i,j-1],0)) {
                    playerPoints--;
                    adjacentToEnemySpace += [i,j-1];
                }
            }
            if ((i+1) < gameBoard.length) {
                if (gameBoard[i+1][j] == EMPTY && !adjacentToEnemySpace.includes([i+1,j],0)) {
                    playerPoints--;
                    adjacentToEnemySpace += [i+1,j];
                }
            }
            if ((j+1) < gameBoard.length) {
                if (gameBoard[i][j+1] == EMPTY && !adjacentToEnemySpace.includes([i,j+1],0)) {
                    playerPoints--;
                    adjacentToEnemySpace += [i,j+1];
                }
            }
        }
    }
}

/**
 * Check if the game is over. This function is called after a season has been scored.
 * The game is over when three seasons have been scored.
 * If the game is not over, then we re-create the explore deck, reveal the top card to the player,
 * and the next season begins.
 * At the end of the game, the players final score is passed to the database to be stored 
 */
function checkIfGameOver() {
    if (seasonsScored == 3) {
        currentPiece = "";
        document.getElementById("gameOver").innerHTML = "Your final score was: " + playerPoints + ". Great Job!";
        const s = JSON.stringify(playerPoints);
        var pathname = window.location.pathname;
        facebookIt();
        $.ajax({
            url:pathname,
            type:"POST",
            contentType:"application/json",
            data: JSON.stringify(s)
        });
        $("#gameOverModal").modal("toggle");
    } else {
        initializeExploreDeck();
        determineNumberOfCardsThisSeason();
        currentPiece = exploreDeck.pop();
        checkCurrentPieceCanBePlaced();
        renderPiece(currentPiece);
    }
}

/**
 * Perform a Fisher-Yates shuffle on the given array, which randomizes the order of all elements in the array.
 * @param {*} array The array to be shuffled
 */
function shuffle (array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(rand() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex],array[currentIndex]];
    }
    return array;
}