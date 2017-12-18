import { GameManager, GameState, EndGameStatus } from "./../models";
import gameMessages from "../game-messages";
import { Move } from "../models";
import Board from "../board";
import Player from "../player";

export default class Game implements GameManager {
    public readonly board: Board;
    private state: GameState;

    constructor(xSize: number = 3, ySize: number = 3) {
        this.board = new Board(xSize, ySize);
        this.initializePlayers();
        this.initializeGame();
    }

    private set boardPosition([x, y]: Move) {
        this.board.setPosition([x, y], this.currentPlayer.symbolId);
        this.moveHistory = [x, y];
    }

    private set moveHistory(move: Move) {
        this.state.moveHistory.push(move);
    }

    private get currentPlayerTurnIndex(): number {
        return this.state.currentPlayerTurnIndex;
    }

    private set currentPlayerTurnIndex(turnIndex: number) {
        const numOfPlayers = this.player.length;
        if (turnIndex >= numOfPlayers) {
            this.currentPlayerTurnIndex = turnIndex - numOfPlayers;
        }
        else {
            this.state.currentPlayerTurnIndex = turnIndex;
        }
    }

    private get currentPlayer(): Player {
        return this.state.players[this.currentPlayerTurnIndex];
    }

    public get status(): EndGameStatus {
        return gameMessages.status[this.state.endGameStatus + ""];
    }

    private setStatus(status: EndGameStatus) {
        this.state.endGameStatus = status;
    }

    private get player(): Player[] {
        return this.state.players;
    }

    private get firstPlayer(): Player {
        return this.player[0];
    }

    public initializeGame(): void {
        this.state = {
            ...this.state,
            endGameMessage: "",
            currentPlayerTurnIndex: 0,
            moveHistory: [],
            endGameStatus: EndGameStatus.InProgress
        };
        this.board.resetBoard();
    }

    public initializePlayers(): void {
        this.state = {
            ...this.state,
            players: [],
            currentPlayerTurnIndex: 0
        }
    }

    public addPlayer(player: Player) {
        this.state.players.push(player);
        this.initializeGame();
    }

    private advanceTurn(): void {
        this.currentPlayerTurnIndex++;
    }

    public printSummary(): void {
        console.log(this.status + " " 
            + this.state.endGameMessage 
            + "\nGame history: ", this.state.moveHistory);
    }

    public nextMove(row: number, col: number): boolean {
        if (this.isGameOver()) {
            console.log(gameMessages.gameOver);
            return false;
        }

        const xCoordinate = col,
        yCoordinate = row,
        move: Move = [xCoordinate, yCoordinate];

        if (this.board.isMoveOutOfBounds(move)) {
            this.alertIllegalMove(gameMessages.illegalMove.outOfBounds);
            return false;
        }
        else if (this.board.isMoveTaken(move)) {
            this.alertIllegalMove(gameMessages.illegalMove.occupied);
            return false;
        }
        else {
            this.boardPosition = move;
            this.evaluateGamePosition();
            if (!this.isGameOver()) {
                this.advanceTurn();
            }
        }
        return true;
    }

    private evaluateGamePosition(): void {
        if (this.isGameWon()) {
            this.setStatus(EndGameStatus.Completed);
            this.state.endGameMessage = gameMessages.gameEndWinner(this.currentPlayer.name);
        }
        else if (this.board.isBoardFull(this.state.moveHistory.length)) {
            this.setStatus(EndGameStatus.Completed);
            this.state.endGameMessage = gameMessages.gameEndDraw;
        }
    }

    private alertIllegalMove(message: string): void {
        console.log(message);
    }

    private isGameOver(): boolean {
        const { endGameStatus } = this.state;
        return endGameStatus !== EndGameStatus.InProgress;
    }


    private isGameWon(): boolean {
        const currentPlayerSymbolId = this.currentPlayer.symbolId;
        return this.board.isRowWin(currentPlayerSymbolId) 
            || this.board.isColumnWin(currentPlayerSymbolId) 
            || this.board.isDiagonalWin(currentPlayerSymbolId);
    }
}
