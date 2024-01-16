//An object that represents the state of the game board
const gameBoard = (() => {
    //Represents the current state of the board
    const boardPositions = [];
    //Representes the available positions in the current moment
    const freePositions = [];
    
    for(let i = 0; i < 9; i++){
        boardPositions[i] = '';
    }

    for(let i = 0; i < 9; i++){
        freePositions.push(i);
    }   

    //Picks a random position that isn't occupied by a marker
    function getRandomAvailablePosition(){
        let randomAvailablePosition = freePositions[Math.floor(Math.random() * freePositions.length)];
        return randomAvailablePosition;
    }

    //Removes the position from the available positions array when a marker gets placed on it
    function removeAvailablePosition(positionValue){
        let index = freePositions.indexOf(positionValue);
        freePositions.splice(index, 1);
    }

    return { boardPositions, freePositions, getRandomAvailablePosition, removeAvailablePosition };
})();

//An object that represents the human player
const humanPlayer = (() => {
    let marker;

    const getMarker = () => {
        return marker;
    }
    const setMarker = (value) => {
        marker = value;
    }
    
    //Sets the player marker on a selected position
    function makeMove(position){
        if(gameBoard.boardPositions[position] == ''){
            gameBoard.boardPositions[position] = humanPlayer.getMarker();
            gameBoard.removeAvailablePosition(position);
        } 
    }

    return { getMarker, setMarker, makeMove }
})()

//An object that represents the computer player
const computerPlayer = (() => {
    let marker;

    const getMarker = () => {
        return marker;
    }
    const setMarker = (value) => {
        marker = value
    }

    //Sets the computer marker on a randomly selected position
    function makeMove(){
        let position = gameBoard.getRandomAvailablePosition();

        if(gameBoard.boardPositions[position] == ''){
            gameBoard.boardPositions[position] = computerPlayer.getMarker();
            gameBoard.removeAvailablePosition(position);
        }
    }

    return { getMarker, setMarker, makeMove }
})();

//An object that manages the UI part of the game
const display = (() => {
    const xButton = document.querySelector('#gp-x-button');
    const oButton = document.querySelector('#gp-o-button');
    const resultDisplay = document.querySelector('#gp-result-info');

    const grid = document.querySelector('#gp-grid');
    const gridChildren = Array.from(grid.children);

    //Disables the board buttons until the game markers are determined
    gridChildren.forEach(square => {
        square.disabled = true;
    });

    const newGameButton = document.createElement('button');
    newGameButton.classList.add('new-game-button');
    newGameButton.textContent = "NEW GAME";

    let position;

    function disableMarkerSelectionButtons(){
        xButton.disabled = false;
        oButton.disabled = true;
    }

    //Enables the gameboard buttons
    function enableBoardButtons() {
        gridChildren.forEach(square => {
            square.disabled = false;
        });
    }

    //Disables the positions that currently have a marker placed on them
    function disableUnavailablePositions(){
        gridChildren.forEach(square => {
            if(square.textContent !== ""){
                square.disabled = true;
            }
        });
    }

    function updateDisplay(){
        for(let i = 0; i < gameBoard.boardPositions.length; i++){
            gridChildren[i].textContent = gameBoard.boardPositions[i];
        }
        if(gameController.getTurn() == 9 || gameController.checkVictory().gameEnded){
            resultDisplay.textContent = gameController.checkVictory().gameEndMessage;
            resultDisplay.appendChild(newGameButton);
        }
    }

    xButton.addEventListener('click', () => {
        humanPlayer.setMarker('X');
        computerPlayer.setMarker('O');
        disableMarkerSelectionButtons();
        enableBoardButtons();
        disableUnavailablePositions();
    });

    oButton.addEventListener('click', () => {
        humanPlayer.setMarker('O');
        computerPlayer.setMarker('X');
        computerPlayer.makeMove();
        gameController.incrementTurn();
        disableMarkerSelectionButtons();
        enableBoardButtons();
        disableUnavailablePositions();
        updateDisplay();
    });

    function clickHandlerBoard(e) {
        position = +e.target.dataset.position;
        if(gameBoard.boardPositions[position] == ''){
            gameController.playRound(position);
        }
        updateDisplay();
    }
    grid.addEventListener("click", clickHandlerBoard);

    //Starts a new game
    newGameButton.addEventListener('click', () => {
        window.location.reload();
    });
})();

//Sets up the game flow of the current round
const gameController = (() => {
    let turn = 0;

    const getTurn = () => turn;

    const incrementTurn = () => {
        turn++;
    }

    //Orhestrates a 10 turn based round of Tic Tac Toe
    function playRound(position){

        if(turn < 10 && !checkVictory().gameEnded){
            //Determines which player goes first based on the marker 
            //Makes it so the player plays when it's his turn only
            //Always checking if the game has a victor, if it does, the game ends before the last turn
            if(humanPlayer.getMarker() == 'X' && turn < 10 && turn % 2 == 0 && !checkVictory().gameEnded){
                turn++;
                humanPlayer.makeMove(position);
            }
            if(humanPlayer.getMarker() == 'X' && turn < 9 && turn % 2 == 1 && !checkVictory().gameEnded){
                turn++;
                computerPlayer.makeMove();
            }
            if(humanPlayer.getMarker() == 'O' && turn < 9 && turn % 2 == 1 && !checkVictory().gameEnded){
                turn++;
                humanPlayer.makeMove(position);
            }
            if(humanPlayer.getMarker() == 'O' && turn < 10 && turn % 2 == 0 && !checkVictory().gameEnded){
                turn++;
                computerPlayer.makeMove();
            }
    
            //When a victory condition is met before the last turn
            if(checkVictory().gameEnded){
                return;
            }
            //When there is no victory condition even during the last turn
            if(!checkVictory().gameEnded && turn == 9){
                console.log(checkVictory().gameEndMessage);
            }
        }
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

        //Deterimines whether a player has won the game
        let gameEnded = false;
        //The default value of the message is a draw, it get's changed when some victory requirement below is fulfilled
        let gameEndMessage =  "It's a draw!";

        if(gameBoard.boardPositions[0] !== '' && gameBoard.boardPositions[0] === gameBoard.boardPositions[1] && gameBoard.boardPositions[0] === gameBoard.boardPositions[2]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[0]}!`;
        }
        if(gameBoard.boardPositions[3] !== '' && gameBoard.boardPositions[3] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[5]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[3]}!`;
        }
        if(gameBoard.boardPositions[6] !== '' && gameBoard.boardPositions[6] === gameBoard.boardPositions[7] && gameBoard.boardPositions[7] === gameBoard.boardPositions[8]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[6]}!`;
        }
        if(gameBoard.boardPositions[0] !== '' && gameBoard.boardPositions[0] === gameBoard.boardPositions[3] && gameBoard.boardPositions[3] === gameBoard.boardPositions[6]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[0]}!`;
        }
        if(gameBoard.boardPositions[1] !== '' && gameBoard.boardPositions[1] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[7]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[1]}!`;
        }
        if(gameBoard.boardPositions[2] !== '' && gameBoard.boardPositions[2] === gameBoard.boardPositions[5] && gameBoard.boardPositions[5] === gameBoard.boardPositions[8]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[2]}!`;
        }
        if(gameBoard.boardPositions[0] !== '' && gameBoard.boardPositions[0] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[8]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[0]}!`;
        }
        if(gameBoard.boardPositions[2] !== '' && gameBoard.boardPositions[2] === gameBoard.boardPositions[4] && gameBoard.boardPositions[4] === gameBoard.boardPositions[6]){
            gameEnded = true;
            gameEndMessage = `Victory for ${gameBoard.boardPositions[2]}!`;
        }
            
        return { gameEnded, gameEndMessage };
    }

    return { getTurn, incrementTurn, playRound, checkVictory };
})();


  







