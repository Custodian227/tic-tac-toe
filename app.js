//An object that represents the state of the game board
const gameBoard = (() => {
    const boardPositions = [];

    for(let i = 0; i < 9; i++){
        boardPositions[i] = '';
    }

    return { boardPositions };
})();

//An object that keeps track of the assignment of markers for the current round
const gameMarkers = (() => {
    let playerMarker = prompt("X or O?");     
    let computerMarker;

    if(playerMarker === 'X'){
        computerMarker = 'O';
    }
    if(playerMarker === 'O'){
        computerMarker = 'X';
    }

    return { playerMarker, computerMarker };
})();

//An object that keeps track of available positions on the board
const availablePositions = (() => {
    let freePositions = [];

    for(let i = 0; i < 9; i++){
        freePositions.push(i);
    }   

    return { freePositions };
})();

//Tracks the status of available positions on the board
//A computer can't place a marker on an already preoccupied spot anymore
function removeAvailablePosition(positionValue){
    let index = availablePositions.freePositions.indexOf(positionValue);
    availablePositions.freePositions.splice(index, 1);
}

function makePlayerMove(){
    let position = +prompt('Pick a spot?');

    if(gameBoard.boardPositions[position] != '') {
        alert("Please pick a free spot");
        makePlayerMove();
    }
    if(gameBoard.boardPositions[position] == ''){
        gameBoard.boardPositions[position] = gameMarkers.playerMarker;
        removeAvailablePosition(position);
    } 
}
 
function makeComputerMove(){
    let position = getRandomAvailablePosition();

    if(gameBoard.boardPositions[position] == ''){
        gameBoard.boardPositions[position] = gameMarkers.computerMarker;
        removeAvailablePosition(position);
    }
}

//Randmoly picks a free spot on the game board where the computer can place it's marker
function getRandomAvailablePosition(){
    let randomAvailablePosition = availablePositions.freePositions[Math.floor(Math.random() * availablePositions.freePositions.length)];
    return randomAvailablePosition;
}

//Victory conditions for marker positions on the board
//0, 1, 2   row 1                   
//3, 4, 5   row 2             0 | 1 | 2
//6, 7, 8   row 3           -------------                       
//1, 4, 7   column 1          3 | 4 | 5      
//0, 3, 6   column 2        ------------- 
//2, 5, 8   column 3          6 | 7 | 8
//0, 4, 8   diagonal 1          
//2, 4, 6   diagonal 2
function checkVictory(){

    let gameEnded = false;

    if(gameBoard.boardPositions[0] !== '' && gameBoard.boardPositions[0] === gameBoard.boardPositions[1] && gameBoard.boardPositions[0] === gameBoard.boardPositions[2]){
        console.log(`Victory for ${gameBoard.boardPositions[0]}`);
        gameEnded = true;
    }
    if(gameBoard.boardPositions[3] !== '' && gameBoard.boardPositions[3] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[5]){
        console.log(`Victory for ${gameBoard.boardPositions[3]}`);
        gameEnded = true;
    }
    if(gameBoard.boardPositions[6] !== '' && gameBoard.boardPositions[6] === gameBoard.boardPositions[7] && gameBoard.boardPositions[7] === gameBoard.boardPositions[8]){
        console.log(`Victory for ${gameBoard.boardPositions[6]}`);
        gameEnded = true;
    }
    if(gameBoard.boardPositions[0] !== '' && gameBoard.boardPositions[0] === gameBoard.boardPositions[3] && gameBoard.boardPositions[3] === gameBoard.boardPositions[6]){
        console.log(`Victory for ${gameBoard.boardPositions[0]}`);
        gameEnded = true;
    }
    if(gameBoard.boardPositions[1] !== '' && gameBoard.boardPositions[1] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[7]){
        console.log(`Victory for ${gameBoard.boardPositions[1]}`);
        gameEnded = true;
    }
    if(gameBoard.boardPositions[2] !== '' && gameBoard.boardPositions[2] === gameBoard.boardPositions[5] && gameBoard.boardPositions[5] === gameBoard.boardPositions[8]){
        console.log(`Victory for ${gameBoard.boardPositions[2]}`);
        gameEnded = true;
    }
    if(gameBoard.boardPositions[0] !== '' && gameBoard.boardPositions[0] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[8]){
        console.log(`Victory for ${gameBoard.boardPositions[0]}`);
        gameEnded = true;
    }
    if(gameBoard.boardPositions[2] !== '' && gameBoard.boardPositions[2] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[6]){
        console.log(`Victory for ${gameBoard.boardPositions[2]}`);
        gameEnded = true;
    }
        
    return gameEnded;
}

//Starts a tic-tac-toe round
(() => {
    let turn = 0;

    while(turn < 10){
        turn++;
        if(gameMarkers.playerMarker == 'X' && turn < 10 && turn % 2 == 1){
            makePlayerMove();
        }
        if(gameMarkers.playerMarker == 'X' && turn < 9 && turn % 2 == 0){
            makeComputerMove();
        }
        if(gameMarkers.playerMarker == 'O' && turn < 10 && turn % 2 == 1){
            makeComputerMove();
        }
        if(gameMarkers.playerMarker == 'O' && turn < 9 && turn % 2 == 0){
            makePlayerMove();
        }
        if(checkVictory()){
            break;
        }
        if(!checkVictory()){
            console.log(gameBoard.boardPositions);
        }
        if(!checkVictory() && turn == 9){
            console.log('Draw');
            break;
        }
    }
})();



  
    



    


