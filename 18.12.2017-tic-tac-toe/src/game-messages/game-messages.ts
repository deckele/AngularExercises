const gameOver = "Game Over!";
const gameInProgress = "Game In Progress!"
const illegalMove = "Illegal move!";

export default {
    gameOver,
    gameEndWinner: (winner: string) => `\n${winner} has won the Game!`,
    gameEndDraw: `\nIt's a draw!`,
    illegalMove: {
        occupied: `${illegalMove}\nposition already occupied.`,
        outOfBounds: `${illegalMove}\nposition out of board bounds.`
    },
    status: {
        0: gameInProgress,
        1: gameOver
    }
}
