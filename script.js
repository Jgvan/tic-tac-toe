//
// const elements and such goes here
//


const gameBoard = (() => {
    let gameGrid = document.querySelectorAll(".square")
    
    const play = selectedValue => {
        //Do stuff when player picked a square
    } 

    const resetGame = () => {
        //Reset game board
    }

    const checkForWinner = () => {
        //Check if someone won the thing
    }

    return {play, resetGame}
})();

const player = (marker, playerName, isAI) => {
    const getName = () => playerName;
    const getMarker = () => marker;
    const getIsAI = () => isAI;
}