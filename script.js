const gameBoard = (() => {
    let gridArray = Array(9).fill("");

    const play = selectedValue => {
        //Do stuff when player picked a square
    }

    const resetGame = () => {
        gridArray = Array(9).fill("");
    }

    const checkForWinner = () => {
        //Check if someone won the thing
    }

    return { play, resetGame }
})();

const player = (marker, playerName, isAI) => {
    const getName = () => playerName;
    const getMarker = () => marker;
    const getIsAI = () => isAI;

    return { getName, getMarker, getIsAI }
}

//Runs the display changes
const displayController = (() => {

    const gameGrid = document.querySelector(".game-grid");

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
    }

    const placeMarker = event => {
        if (event.target.classList.contains("unselected")) {
            event.target.classList.remove("unselected");
            playerController.switchActivePlayer();
        }
    }

    return { toggleSquareSelection, resetGrid, addGridEventListener, removeGridEventListener }
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
        displayController.toggleSquareSelection(activePlayer.getMarker());
    }

    const getActivePlayer = () => activePlayer;

    return { setPlayerOne, setPlayerTwo, switchActivePlayer, getActivePlayer }
})();

const gameController = (() => {

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
    }
    return { newTwoPlayerGame, newSinglePlayerGame }
})();

displayController.addGridEventListener();