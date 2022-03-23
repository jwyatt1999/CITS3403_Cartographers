const EMPTY = 0;
const MOUNTAIN = 1;
const BLOCKED = 2;
const FARM = 3;
const FOREST = 4;
const VILLAGE = 5;
const RIVER = 6;
const ENEMY = 7;

var gameBoard;
var playerPoints;
var scoreFunction1;
var scoreFunction2;
var scoreFunction3;
var scoreFunction4;

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

    renderBoard();

    playerPoints = 0;

    renderPlayerPoints();

    initializeScoreCards();

    scoreGreen(gameBoard);

}



function renderBoard() {
    for (let i = 0; i < gameBoard.length; i++) {
        var gameBoardRow = gameBoard[i].toString().replace(/[^0-7]/g,"");
        var colourBoard = "";
        for (let j = 0; j < gameBoardRow.length; j++) {
            let c = gameBoardRow.charAt(j);
            console.log(c);
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
                default:
                    console.log("somehow got here");
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
    console.log("initializing...");
}