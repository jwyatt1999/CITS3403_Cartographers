/** Enumerated constant that represents an empty space on the game board. */
const EMPTY = 0;
/** Enumerated constant that represents a mountain space on the game board. */
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

/** Global variable that holds the state of the game board after the previous piece was placed. */
var gameBoard;
/** Global variable that holds the total points the player has scored this game. */
var playerPoints;
/** Global variable that holds the randomized order of the score cards, which determines which season they are scored in. */
var scoreCardOrder;
/** Global variable that holds the explore deck, which determines what piece the player will be placing next. */
var exploreDeck;
/** Global variable that holds the piece that the player is currently placing. */
var currentPiece;
/** Global variable that holds a value between 0 and 3, which is used to determine when the game is over (when 3 seasons have been scored). */
var seasonsScored;
/** Global variable that holds a value which is reduced whenever a piece is placed. When it reaches zero, the current season is scored and the next season begins. */
var cardsThisSeason;

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
    if (currentPiece.toString() != "") {
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
            case "Enter":
                if (successfullyPlacedPiece(currentPiece)) {
                    checkIfSeasonOver();
                }
                break;
        }
        checkCurrentPieceLegallyPlaced();
        renderPiece(currentPiece);
    }
};

/**
 * Starts a new game by initialising and rendering the game board, player points, score cards, 
 * and explore deck, and revealing the top card of the explore deck to the player.
 */
function startGame() {
    document.getElementById("startButton").hidden=true;
    document.getElementById("gameOver").innerHTML = "";

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
    renderBoard(gameBoard);

    playerPoints = 0;
    renderPlayerPoints();

    seasonsScored = 0;
    initializeScoreCards();
    for (let card = 1; card < scoreCardOrder.length+1; card++) {
        document.getElementById("scoreCard" + card).innerHTML = scoreCardOrder[card-1]; 
    }

    cardsThisSeason = 4;
    initializeExploreDeck();
    currentPiece = exploreDeck.pop();
    checkCurrentPieceCanBePlaced();
    renderPiece(currentPiece);
}

/**
 * Renders the given game board on the game_page. The board is stored in a html table on the game_page.
 * The style ensures the cells of the table are fully coloured.
 * @param {*} board The board to render
 */
function renderBoard(board) {
    for (let i = 0; i < board.length; i++) {
        //Convert each board row from (eg.) "0,0,0,0,0,0,0,0" to "00000000". We remove everything that isn't 0-8 (the values of the enumerated constants).
        let gameBoardRow = board[i].toString().replace(/[^0-8]/g,""); 
        let colourBoard = "";
        for (let j = 0; j < gameBoardRow.length; j++) {
            let c = gameBoardRow.charAt(j);
            switch (parseInt(c)) {
                case EMPTY:
                    colourBoard += "<td style=\"color:white;background-color:white;\">0</td>";
                    break;
                case MOUNTAIN:
                    colourBoard += "<td style=\"color:brown;background-color:brown;\">1</td>";
                    break;
                case BLOCKED:
                    colourBoard += "<td style=\"color:black;background-color:black;\">2</td>";
                    break;
                case FARM:
                    colourBoard += "<td style=\"color:yellow;background-color:yellow;\">3</td>";
                    break;
                case FOREST:
                    colourBoard += "<td style=\"color:green;background-color:green;\">4</td>";
                    break;
                case VILLAGE:
                    colourBoard += "<td style=\"color:red;background-color:red;\">5</td>";
                    break;
                case RIVER:
                    colourBoard += "<td style=\"color:blue;background-color:blue;\">6</td>";
                    break;
                case ENEMY:
                    colourBoard += "<td style=\"color:purple;background-color:purple;\">7</td>";
                    break;
                case OVERLAP:
                    colourBoard += "<td style=\"color:orange;background-color:orange;\">8</td>";
                    break;
            }
        }
        //game_page.html stores the game board in a table which has rows with id from boardRow0 to boardRow7
        var boardRender = document.getElementById("boardRow"+i);
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
 * Select the score cards for this game and randomize their order.
 */
function initializeScoreCards() {
    scoreCardOrder = ["R","G","B"];
    shuffle(scoreCardOrder);
}

/**
 * Create the explore deck by adding the base 4 pre-determined (for now) cards and shuffling.
 */
function initializeExploreDeck() {
    exploreDeck = [];
    exploreDeck.push({type:FOREST,shape:[[0,0],[-1,0],[0,1],[1,1]],location:[4,4]});
    exploreDeck.push({type:FARM,shape:[[0,0],[1,0],[-1,0],[0,1],[0,-1]],location:[4,4]});
    exploreDeck.push({type:VILLAGE,shape:[[0,0],[1,0],[-1,0],[0,-1],[-1,-1]],location:[4,4]});
    exploreDeck.push({type:RIVER,shape:[[0,0],[1,1],[-1,-1],[1,0],[0,-1]],location:[4,4]});
    shuffle(exploreDeck);
}

/**
 * Check if the current piece can be placed on the game board.
 * If the piece cannot legally be placed anywhere then we reduce the piece to a 1x1 block.
 */
function checkCurrentPieceCanBePlaced() {
    let ableToBePlaced = false;
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
                rotatePiece(currentPiece);
                for (let blockNumber = 0; blockNumber < currentPiece.shape.length; blockNumber++) {
                    let x_coord_block = currentPiece.shape[blockNumber][1] + j;
                    let y_coord_block = currentPiece.shape[blockNumber][0] + i;
                    if (x_coord_block < 0 || y_coord_block < 0 || x_coord_block >= gameBoard.length || y_coord_block >= gameBoard.length 
                        || gameBoard[y_coord_block][x_coord_block] != EMPTY) {
                        pieceCanBePlaced = false;
                    }
                }
                //Check if flipping the piece allows the piece to be placed
                if (!pieceCanBePlaced) {
                    flipPiece(currentPiece);
                    for (let blockNumber = 0; blockNumber < currentPiece.shape.length; blockNumber++) {
                        let x_coord_block = currentPiece.shape[blockNumber][1] + j;
                        let y_coord_block = currentPiece.shape[blockNumber][0] + i;
                        if (x_coord_block < 0 || y_coord_block < 0 || x_coord_block >= gameBoard.length || y_coord_block >= gameBoard.length 
                            || gameBoard[y_coord_block][x_coord_block] != EMPTY) {
                            pieceCanBePlaced_flipped = false;
                        }
                    }
                    //Flip the piece back to it's original orientation
                    flipPiece(currentPiece);
                }
                if (pieceCanBePlaced || pieceCanBePlaced_flipped) {
                    ableToBePlaced = true;
                }
            }
        }
    }
    if (!ableToBePlaced) {
        currentPiece.shape = [[0,0]]
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
                //The for loop is broken after each translation to prevent the block being moved back (eg.) 3 spaces
                //if it had 3 blocks out of bounds but the piece would be within the bounds after 1 translation.
                break;
            }
            if (x_coord_block >= gameBoard.length) {
                currentPiece.location[1]--;
                break;
            }
            if (y_coord_block < 0) {
                currentPiece.location[0]++;
                break;
            }
            if (y_coord_block >= gameBoard.length) {
                currentPiece.location[0]--;
                break;
            }
        }
        allBlocksLegal = true;
    }
}

/**
 * Renders the location of the given piece on the current game board without altering the current game board.
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
    let x_coord = piece.location[1];
    let y_coord = piece.location[0];
    for (let blockNumber = 0; blockNumber < shape.length; blockNumber++) {
        let x_coord_block = shape[blockNumber][1] + x_coord;
        let y_coord_block = shape[blockNumber][0] + y_coord;
        if (0 <= x_coord_block && x_coord_block < tempBoard.length && 0 <= y_coord_block && y_coord_block < tempBoard.length) {
            if (tempBoard[x_coord_block][y_coord_block] == EMPTY) {
                tempBoard[x_coord_block][y_coord_block] = type;
            } else {
                tempBoard[x_coord_block][y_coord_block] = OVERLAP;
            }
        }
    }
    renderBoard(tempBoard);
    delete tempBoard;
}

/**
 * Rotates the given piece 90 degrees clockwise about the primary block.
 * @param {*} piece The piece to rotate
 */
function rotatePiece(piece) {
    let shape = piece.shape;
    for (let blockNumber = 0; blockNumber < shape.length; blockNumber++) {
        let temp = shape[blockNumber][0];
        shape[blockNumber][0] = -shape[blockNumber][1]
        shape[blockNumber][1] = temp;
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
    let x_coord = piece.location[1];
    let y_coord = piece.location[0];
    //Attempt to place the piece on the temporary game board
    for (let blockNumber = 0; blockNumber < shape.length; blockNumber++) {
        let x_coord_block = shape[blockNumber][1] + x_coord;
        let y_coord_block = shape[blockNumber][0] + y_coord;
        if (0 <= x_coord_block && x_coord_block < tempBoard.length && 0 <= y_coord_block && y_coord_block < tempBoard.length) {
            if (tempBoard[x_coord_block][y_coord_block] == EMPTY) {
                tempBoard[x_coord_block][y_coord_block] = type;
            } else {
                return false;
            }
        }
    }
    //If we got here then the piece has been legally placed on the temporary board so we make that the new game board
    copyBoard(gameBoard, tempBoard);
    renderBoard(gameBoard);
    delete tempBoard;
    //A piece has been placed so we decrement the number of explore cards (pieces) remaining until we score this season
    cardsThisSeason--;
    return true;
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
        switch(scoreCardOrder[seasonsScored]) {
            case "R":
                scoreCardRed(gameBoard);
                break;
            case "G":
                scoreCardGreen(gameBoard);
                break;
            case "B":
                scoreCardBlueYellow(gameBoard);
                break;
        }
        renderPlayerPoints();
        seasonsScored++;
        checkIfGameOver();
    }
}

/**
 * Check if the game is over. This function is called after a season has been scored.
 * The game is over when three seasons have been scored.
 * If the game is not over, then we re-create the explore deck, reveal the top card to the player,
 * and the next season begins.
 */
function checkIfGameOver() {
    if (seasonsScored == 3) {
        currentPiece = "";
        document.getElementById("gameOver").innerHTML = "Game Over! Your final score was: " + playerPoints + ". Great Job!";
        document.getElementById("startButton").hidden=false;
    } else {
        initializeExploreDeck();
        cardsThisSeason = 4;
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
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex],array[currentIndex]];
    }
}