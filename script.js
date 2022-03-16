const gameBoard = (() => {
    let gridArray = Array(9).fill("");

    //Clear the array
    const resetGame = () => {
        gridArray = Array(9).fill("");
    }

    //Did anyone win?
    const checkForWinner = marker => {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningCombos.length; i++) {
            if ((gridArray[winningCombos[i][0]] === marker) && (gridArray[winningCombos[i][1]] === marker) && (gridArray[winningCombos[i][2]] === marker)) {
                displayController.setGameText(playerController.getActivePlayer().getName() + " wins!");
                return true;
            }
        }
        return false;
    }

    //Add marker to the array
    const addMarker = (position, marker) => {
        gridArray[parseInt(position)] = marker;
        if (checkForWinner(marker)) {
            gameController.gameOver();
        }
        else if (!gridArray.includes("")) {
            gameController.gameOver();
            displayController.setGameText("It's a tie!");
        }
    }

    return { resetGame, addMarker }
})();

//Player object
const player = (marker, playerName, isAI) => {
    const getName = () => playerName;
    const getMarker = () => marker;
    const getIsAI = () => isAI;

    return { getName, getMarker, getIsAI }
}

//Runs the display changes
const displayController = (() => {

    const gameGrid = document.querySelector(".game-grid");
    const gameText = document.querySelector(".game-text");

    const addGridEventListener = () => {
        gameGrid.addEventListener("click", placeMarker);
    }

    const removeGridEventListener = () => {
        gameGrid.removeEventListener("click", placeMarker);
    }

    //Set the value of unselected squares to display for the :hover effect
    const toggleSquareSelection = symbol => {
        let unselected = document.querySelectorAll(".unselected");

        unselected.forEach((el) => {
            el.textContent = symbol;
        });
    }

    const resetGrid = () => {
        let squares = document.querySelectorAll(".square");

        squares.forEach((square) => {
            square.classList.add("unselected");
        });
        gameBoard.resetGame();
    }

    const setGameText = msg => gameText.textContent = msg;

    const placeMarker = event => {
        if (event.target.classList.contains("unselected")) {
            event.target.classList.remove("unselected");
            gameBoard.addMarker(event.target.dataset.value, playerController.getActivePlayer().getMarker());
            playerController.switchActivePlayer();
        }
    }

    return { toggleSquareSelection, resetGrid, addGridEventListener, removeGridEventListener, setGameText }
})();


//Handles the players
const playerController = (() => {
    let playerOne;
    let playerTwo;
    let activePlayer;

    //Set player one and also set him to be first active player
    const setPlayerOne = player => {
        playerOne = player;
        activePlayer = playerOne;
    }
    const setPlayerTwo = player => {
        playerTwo = player;
    }

    const switchActivePlayer = () => {
        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
        }
        else {
            activePlayer = playerOne;
        }
        if (activePlayer.isAI) {
            //TODO: If AI then run AI pick command
        }
        if (gameController.getGameStatus()) { displayController.toggleSquareSelection(activePlayer.getMarker()); }
    }

    const getActivePlayer = () => activePlayer;

    return { setPlayerOne, setPlayerTwo, switchActivePlayer, getActivePlayer }
})();

const gameController = (() => {
    let gameRunning = false;
    
    //Starts a new player vs player game
    const newTwoPlayerGame = () => {
        const pOne = player("X", "Player One", false);
        const pTwo = player("O", "Player Two", false);
        playerController.setPlayerOne(pOne);
        playerController.setPlayerTwo(pTwo);
        start();
    }

    //Starts a new player vs AI game
    const newSinglePlayerGame = () => {
        const pOne = player("X", "Player One", false);
        const pTwo = player("O", "AI", true);
        playerController.setPlayerOne(pOne);
        playerController.setPlayerTwo(pTwo);
        start();
    }

    const start = () => {
        displayController.resetGrid();
        displayController.toggleSquareSelection("X");
        displayController.addGridEventListener();
        displayController.setGameText("");
        gameRunning = true;
    }

    const gameOver = () => {
        displayController.toggleSquareSelection("");
        displayController.removeGridEventListener();
        gameRunning = false;
    }

    const getGameStatus = () => gameRunning;


    return { newTwoPlayerGame, newSinglePlayerGame, gameOver, getGameStatus }
})();

