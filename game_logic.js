const EMPTY = 0;
const MOUNTAIN = 1;
const BLOCKED = 2;
const FARM = 3;
const FOREST = 4;
const VILLAGE = 5;
const RIVER = 6;
const ENEMY = 7;
const OVERLAP = 8;

var gameBoard;
var playerPoints;
var scoreCardOrder;
var exploreDeck;
var currentPiece;

document.onkeydown = function(e) {
    if (currentPiece.toString() != "") {
        switch (e.key) {
            case "ArrowLeft":
                currentPiece.location[1]--;
                if (currentPiece.location[1] < 0) {
                    currentPiece.location[1] = 0;
                } else if (currentPiece.location[1] > 7) {
                    currentPiece.location[1] = 7;
                }
                break;
            case "ArrowRight":
                currentPiece.location[1]++;
                if (currentPiece.location[1] < 0) {
                    currentPiece.location[1] = 0;
                } else if (currentPiece.location[1] > 7) {
                    currentPiece.location[1] = 7;
                }
                break;
            case "ArrowUp":
                currentPiece.location[0]--;
                if (currentPiece.location[0] < 0) {
                    currentPiece.location[0] = 0;
                } else if (currentPiece.location[0] > 7) {
                    currentPiece.location[0] = 7;
                }
                break;
            case "ArrowDown":
                currentPiece.location[0]++;
                if (currentPiece.location[0] < 0) {
                    currentPiece.location[0] = 0;
                } else if (currentPiece.location[0] > 7) {
                    currentPiece.location[0] = 7;
                }
                break;
        }
        renderPiece(currentPiece);
    }
};

function startGame() {
    document.getElementById("startButton").hidden=true;

    gameBoard = [
        [1,0,0,0,0,0,0,0],
        [2,0,0,0,0,0,0,0],
        [3,0,0,0,0,0,0,0],
        [4,0,0,0,0,0,0,0],
        [5,0,0,0,0,0,0,0],
        [6,0,0,0,0,0,0,0],
        [7,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];

    renderBoard(gameBoard);

    playerPoints = 0;

    renderPlayerPoints();

    initializeScoreCards();

    for (let card = 1; card < scoreCardOrder.length+1; card++) {
        document.getElementById("scoreCard" + card).innerHTML = scoreCardOrder[card-1]; 
    }

    initializeExploreDeck();

    let seasonsScored = 0;

    currentPiece = exploreDeck.pop();
    renderPiece(currentPiece);

    /*
    while (seasonsScored < 3) {
        let cardsThisSeason = 4;
        while (cardsThisSeason > 0) {
            currentPiece = exploreDeck.pop();
            currentPiece.state = "being_placed";
            renderPiece(currentPiece);
            while (currentPiece.state == "being_placed") {
                currentPiece.state == "banana";
            }
            cardsThisSeason = 0;
        }
        seasonsScored = 3;
    }
    */

}




function renderBoard(board) {
    for (let i = 0; i < board.length; i++) {
        var gameBoardRow = board[i].toString().replace(/[^0-8]/g,"");
        var colourBoard = "";
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
                default:
            }
        }
        var boardRender = document.getElementById("boardRow"+i);
        boardRender.innerHTML = colourBoard;
    }
}

function renderPlayerPoints() {
    var points = document.getElementById("playerPoints");
    points.innerHTML = "Points: " + playerPoints;
}

function initializeScoreCards() {
    scoreCardOrder = ["R","G","B"];
    shuffle(scoreCardOrder);
}

function initializeExploreDeck() {
    exploreDeck = [];
    exploreDeck.push({type:FOREST,shape:[[0,0],[-1,0],[0,1],[1,1]],location:[4,4],state:"in_deck"});
    exploreDeck.push({type:FARM,shape:[[0,0],[1,0],[-1,0],[0,1],[0,-1]],location:[4,4],state:"in_deck"});
    exploreDeck.push({type:VILLAGE,shape:[[0,0],[1,0],[-1,0],[0,-1],[-1,-1]],location:[4,4],state:"in_deck"});
    exploreDeck.push({type:RIVER,shape:[[0,0],[1,1],[-1,-1],[1,0],[0,-1]],location:[4,4],state:"in_deck"});
    shuffle(exploreDeck);
}

function renderPiece(piece) {
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
            if (tempBoard[x_coord_block][y_coord_block] == 0) {
                tempBoard[x_coord_block][y_coord_block] = type;
            } else {
                tempBoard[x_coord_block][y_coord_block] = OVERLAP;
            }
        }
    }
    renderBoard(tempBoard);
    delete tempBoard;
}

function copyBoard(copy, original) {
    for (let i = 0; i < original.length; i++) {
        for (let j = 0; j < original[0].length; j++) {
            copy[i][j] = original[i][j];
        }
    }
}

function shuffle (array) {
    //perform Fisher-Yates shuffle on the given array
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex],array[currentIndex]];
    }
}