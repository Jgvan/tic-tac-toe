const gameBoard = (() => {
    let gridArray = Array(9).fill("");

    //Clear the array
    const resetGame = () => {
        gridArray = Array(9).fill("");
    }

    const getBoardArray = () => gridArray;

    //Did anyone win?
    const checkForWinner = isSimulation => {
        const winningCombos = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 5, 8],
            [3, 4, 5],
            [2, 4, 6],
            [6, 7, 8]
        ]
        for (let i = 0; i < winningCombos.length; i++) {
            if (gridArray[winningCombos[i][0]] === gridArray[winningCombos[i][1]] && gridArray[winningCombos[i][1]] === gridArray[winningCombos[i][2]] && gridArray[winningCombos[i][0]] != "") {
                // console.log("test");
                if (!isSimulation) {
                    displayController.setGameText(playerController.getActivePlayer().getName() + " wins!");
                    displayController.displayWinningSquares(winningCombos[i]);
                }
                // console.log(gridArray[winningCombos[i][0]]);
                return gridArray[winningCombos[i][0]];

                // if ((gridArray[winningCombos[i][0]] === marker) && (gridArray[winningCombos[i][1]] === marker) && (gridArray[winningCombos[i][2]] === marker)) {
                //     if (!isSimulation) {
                //         displayController.setGameText(playerController.getActivePlayer().getName() + " wins!");
                //         displayController.displayWinningSquares(winningCombos[i]);
                //     }
                //     // return true;
                //     return marker;
                // }
            }

            // return false;
        }
        if (!gridArray.includes("")) { return "tie"; }
        return;
    }

    //Add marker to the array
    const addMarker = (position, marker) => {
        gridArray[parseInt(position)] = marker;
        if (checkForWinner(false) === marker) {
            gameController.gameOver();
        }
        else if (!gridArray.includes("")) {
            gameController.gameOver();
            displayController.setGameText("It's a tie!");
        }
    }

    const getIndices = (val) => {
        let indices = [];
        let i = -1;
        while ((i = gridArray.indexOf(val, i + 1)) != -1) {
            indices.push(i);
        }
        return indices;
    }

    //Add and remove from array during MiniMax algorithm without changing the game state
    const editArray = (position, marker) => {
        gridArray[parseInt(position)] = marker;
    }

    return { resetGame, addMarker, getBoardArray, getIndices, editArray, checkForWinner }
})();

//Player object
const player = (marker, playerName, isAI, isSmart) => {
    const getName = () => playerName;
    const getMarker = () => marker;
    const getIsAI = () => isAI;
    const getIsSmart = () => isSmart;

    return { getName, getMarker, getIsAI, getIsSmart }
}

//Runs the display changes
const displayController = (() => {

    const gameGrid = document.querySelector(".game-grid");
    const gameText = document.querySelector(".game-text");
    const playButton = document.getElementById("play");

    const togglePlayButton = () => {
        if (playButton.classList.contains("disabled")) {
            playButton.classList.remove("disabled");
            playButton.addEventListener("click", gameController.play);
        }
        else {
            playButton.classList.add("disabled");
            playButton.removeEventListener("click", gameController.play);
        }
    }

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
            square.classList.remove("winner");
        });
        gameBoard.resetGame();
    }

    const setGameText = msg => gameText.textContent = msg;

    const placeMarker = event => {
        if (event.target.classList.contains("unselected")) {
            event.target.classList.remove("unselected");
            gameBoard.addMarker(event.target.dataset.value, playerController.getActivePlayer().getMarker());
            playerController.switchActivePlayer();
            // console.log(gameBoard.getIndices(""));
        }
    }

    const placeAIMarker = pos => {
        const square = document.querySelector(`[data-value="${pos}"]`);
        square.classList.remove("unselected");
        gameBoard.addMarker(pos, playerController.getActivePlayer().getMarker());
        playerController.switchActivePlayer();
    }

    const displayWinningSquares = squares => {
        for (let i = 0; i < squares.length; i++) {
            document.querySelector(`[data-value="${squares[i]}"]`).classList.add("winner");
        }
    }

    const getPlayers = () => {
        let players = [];

        let playerOneName = document.getElementById("player-one");
        let playerTwoName = document.getElementById("player-two");
        let isPlayerOneAI = document.getElementById("ai-one");
        let isPlayerTwoAI = document.getElementById("ai-two");
        let isAiOneSmart = document.getElementById("ai-one-difficulty");
        let isAiTwoSmart = document.getElementById("ai-two-difficulty");

        playerOneName = playerOneName.value === "" ? playerOneName.placeholder : playerOneName.value;
        playerTwoName = playerTwoName.value === "" ? playerTwoName.placeholder : playerTwoName.value;
        isPlayerOneAI = isPlayerOneAI.checked ? true : false;
        isPlayerTwoAI = isPlayerTwoAI.checked ? true : false;
        isAiOneSmart = isAiOneSmart.value === "hard" ? true : false;
        isAiTwoSmart = isAiTwoSmart.value === "hard" ? true : false;

        let playerOne = player("X", playerOneName, isPlayerOneAI, isAiOneSmart);
        let playerTwo = player("O", playerTwoName, isPlayerTwoAI, isAiTwoSmart);

        players.push(playerOne);
        players.push(playerTwo);
        return players;
    }

    return {
        toggleSquareSelection, resetGrid, addGridEventListener, removeGridEventListener, setGameText,
        displayWinningSquares, placeAIMarker, getPlayers, togglePlayButton
    }
})();


//Handles the players
const playerController = (() => {
    let playerOne;
    let playerTwo;
    let activePlayer;

    const setPlayers = (pOne, pTwo) => {
        playerOne = pOne;
        playerTwo = pTwo;
        activePlayer = undefined;
    }

    const switchActivePlayer = () => {
        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
        }
        else {
            activePlayer = playerOne;
        }
        if (activePlayer.getIsAI()) {
            if (!gameController.getGameStatus()) return;
            displayController.removeGridEventListener();
            displayController.toggleSquareSelection(activePlayer.getMarker());
            setTimeout(() => {
                if (activePlayer.getIsSmart()) {
                    gameController.AISmartMove();
                }
                else {
                    gameController.AIMove();
                }
                if (!gameController.getGameStatus()) return;
                displayController.addGridEventListener();
            }, 300);
        }
        if (gameController.getGameStatus()) { displayController.toggleSquareSelection(activePlayer.getMarker()); }
    }

    const getActivePlayer = () => activePlayer;

    const isPlayerOne = () => {
        if (activePlayer === playerOne) { return true; }
        else { return false; }
    }

    return { setPlayers, switchActivePlayer, getActivePlayer, isPlayerOne }
})();

const gameController = (() => {
    let gameRunning = false;

    const play = () => {
        let players = displayController.getPlayers();

        playerController.setPlayers(players[0], players[1]);
        start();
    }

    const start = () => {
        gameOver();
        displayController.resetGrid();
        displayController.toggleSquareSelection("X");
        displayController.addGridEventListener();
        displayController.setGameText("");
        gameRunning = true;
        playerController.switchActivePlayer();
    }

    const gameOver = () => {
        displayController.toggleSquareSelection("");
        displayController.removeGridEventListener();
        gameRunning = false;
        displayController.togglePlayButton();
    }

    const getGameStatus = () => gameRunning;

    const AIMove = () => {
        const options = gameBoard.getIndices("");
        const choice = options[Math.floor(Math.random() * options.length)];
        displayController.placeAIMarker(choice);
    }

    const AISmartMove = () => {
        if (gameBoard.getIndices("").length === 9) {
            displayController.placeAIMarker(randomCorner());
        }
        else{
            displayController.placeAIMarker(AIController.bestMove());
        }

    }

    const randomCorner = () => {
        let corners = [0, 2, 6, 8];
        return corners[Math.floor(Math.random() * 4)];
    }

    return { gameOver, getGameStatus, AIMove, AISmartMove, play }
})();


const AIController = (() => {

    const bestMove = () => {
        let nextMove;
        let openMoves = gameBoard.getIndices("");

        let maxScore = -Infinity;
        for (let i = 0; i < openMoves.length; i++) {
            gameBoard.editArray(openMoves[i], playerController.getActivePlayer().getMarker());
            let score = miniMax(0, false);
            gameBoard.editArray(openMoves[i], "");
            if (score > maxScore) {
                maxScore = score;
                nextMove = openMoves[i];
            }
        }
        return nextMove;
    }

    const miniMax = (depth, isMaximizing) => {
        let openMoves = gameBoard.getIndices("");
        let marker = playerController.getActivePlayer().getMarker();
        let result = gameBoard.checkForWinner(true);

        if (result === "tie") {
            return 0;
        }
        if (result === marker) {
            return 10 - depth;
        }
        else if (result != undefined) {
            return -10 + depth;
        }
        //Maximizing player
        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let i = 0; i < openMoves.length; i++) {
                gameBoard.editArray(openMoves[i], marker);
                let score = miniMax(depth + 1, false);
                gameBoard.editArray(openMoves[i], "");
                maxScore = Math.max(score, maxScore);
            }
            return maxScore;
        }
        //Minimizing player
        else {
            let minScore = Infinity;
            for (let i = 0; i < openMoves.length; i++) {
                let oppositeMarker = marker === "X" ? "O" : "X";
                gameBoard.editArray(openMoves[i], oppositeMarker);
                let score = miniMax(depth + 1, true);
                gameBoard.editArray(openMoves[i], "");
                minScore = Math.min(score, minScore);
            }
            return minScore;
        }
    }
    return { bestMove }
})();

displayController.togglePlayButton();