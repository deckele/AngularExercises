const gameOver = "Game Over!";
const illegalMove = "Illegal move!";

export default {
    gameOver,
    gameEndWinner: (winner: string) => `${gameOver}\n${winner} has won the Game!`,
    gameEndDraw: `${gameOver}\nIt's a draw!`,
    illegalMove: {
        occupied: `${illegalMove}\nposition already occupied.`,
        outOfBounds: `${illegalMove}\nposition out of board bounds.`
    }
}