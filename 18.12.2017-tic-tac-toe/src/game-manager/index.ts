import { GameManager, GameState, GameProps, Move, EndGameStatus } from "./models";
import gameMessages from "../game-messages";
import * as _ from "lodash";

export default class Game implements GameManager {
    private static readonly defaultProps: GameProps = {
        player1: {
            name: "Player 1",
            symbolIdentifier: "X"
        },
        player2: {
            name: "Player 2",
            symbolIdentifier: "O"
        },
        boardSize: 3
    }

    private readonly props: GameProps;
    private state: GameState;

    constructor(props?: Partial<GameProps>) {
        if (!props) {
            this.props = Game.defaultProps;
        }
        else {
            this.props = _.mergeWith(
                props, 
                Game.defaultProps, 
                (value: any, srcValue: any) => { 
                    if (!value) {
                        return srcValue;
                    }
                    return value;
                }
            );
        }

        this.initializeState(
            this.props.boardSize, 
            this.props.player1.symbolIdentifier
        );
    }

    private set boardPosition([x, y]: Move) {
        this.state.board[x][y] = this.currentPlayer;
        this.moveHistory = [x, y];
    }

    private set moveHistory(val: Move) {
        this.state.moveHistory.push(val);
    }

    private get currentPlayer(): string {
        return this.state.currentPlayerSymbol;
    }

    private set currentPlayer(playerSymbol: string) {
        this.state.currentPlayerSymbol = playerSymbol;
    }

    private get endGameStatus(): EndGameStatus {
        return this.state.endGameStatus;
    }

    private set endGameStatus(status: EndGameStatus) {
        this.state.endGameStatus = status;
    }

    public initializeState(
        boardSize: number = this.props.boardSize, 
        firstPlayerSymbol: string = this.props.player1.symbolIdentifier
    ): void {
        const board = [];
        for (let i = 0; i < boardSize; i++) {
            board[i] = new Array(boardSize);
        }
        this.state = {
            board,
            currentPlayerSymbol: firstPlayerSymbol,
            moveHistory: [],
            endGameStatus: EndGameStatus.InProgress
        };        
    }

    private advanceTurn(): void {
        this.currentPlayer = this.getNextPlayerSymbol();
    }

    private getNextPlayerSymbol(): string {
        const { 
            player1: { symbolIdentifier: symbolIdentifier1 },
            player2: { symbolIdentifier: symbolIdentifier2 } 
        } = this.props;

        return this.currentPlayer === symbolIdentifier1 
            && symbolIdentifier1
            || symbolIdentifier2;
    }

    public move(x: number, y: number): void {
        if (this.isGameOver()) {
            console.log(gameMessages.gameOver);
            return;
        }
        if (this.isMoveOutOfBounds(x, y)) {
            this.alertIllegalMove(gameMessages.illegalMove.outOfBounds);
        }
        else if (this.isMoveTaken(x, y)) {
            this.alertIllegalMove(gameMessages.illegalMove.occupied);
        }
        else {
            this.boardPosition = [x, y];
            this.updateGameStatus();
            if (this.isGameOver()) {
                this.endGame();
            } else {
                this.advanceTurn();
            }
        }
    }

    private endGame(): void {
        const { endGameStatus } = this.state;
        switch (endGameStatus) {
            case EndGameStatus.Draw: {
                console.log(gameMessages.gameEndDraw);
                break;
            }
            case EndGameStatus.Player1Winner: {
                console.log(gameMessages.gameEndWinner(this.props.player1.name));
                break;
            }
            case EndGameStatus.Player2Winner: {
                console.log(gameMessages.gameEndWinner(this.props.player2.name));
                break;
            }
        }
        console.log("Game history: ", this.state.moveHistory);
    }

    private alertIllegalMove(message: string): void {
        console.log(message);
    }

    private isMoveOutOfBounds(x: number, y: number): boolean {
        const { boardSize } = this.props;
        return x >= boardSize || y >= boardSize;
    }

    private isMoveTaken(x: number, y: number): boolean {
        return !!this.getBoardPosition(x, y);
    }

    private getBoardPosition(x: number, y: number): string {
        return this.state.board[x][y];
    }

    private isGameOver(): boolean {
        const { endGameStatus } = this.state;
        return endGameStatus !== EndGameStatus.InProgress;
    }

    private updateGameStatus(): void {
        let status: EndGameStatus;
        if (this.isGameWon()) {
            status = (this.currentPlayer === this.props.player1.symbolIdentifier)
                ? EndGameStatus.Player1Winner
                : EndGameStatus.Player2Winner;
        }
        else if (this.isBoardFull()) {
            status = EndGameStatus.Draw;
        }
        else {
            status = EndGameStatus.InProgress;
        }
        this.endGameStatus = status;
    }

    private isGameWon(): boolean {
        return this.isRowWin() || this.isColumnWin() || this.isDiagonalWin();
    }

    private isRowWin(): boolean {
        const player = this.currentPlayer,
        { boardSize } = this.props;
        
        for (let y = 0; y < boardSize; y++) {
            let rowWon = true;
            for (let x = 0; x < boardSize; x++) {
                if (this.getBoardPosition(x, y) !== player) {
                    rowWon = false;
                    break;
                }
            }
            if (rowWon) {
                return true;
            }
        }
        return false;
    }    

    private isColumnWin(): boolean {
        const player = this.currentPlayer,
        { boardSize } = this.props;
        
        for (let x = 0; x < boardSize; x++) {
            let columnWon = true;
            for (let y = 0; y < boardSize; y++) {
                if (this.getBoardPosition(x, y) !== player) {
                    columnWon = false;
                    break;
                }
            }
            if (columnWon) {
                return true;
            }
        }
        return false;
    }

    private isDiagonalWin(): boolean {
        const player = this.currentPlayer,
        { boardSize } = this.props;

        let diagonal1Win = true,
        diagonal2Win = true;        
        for (let i = 0; i < boardSize; i++) {
            if (this.getBoardPosition(i, i) !== player) {
                diagonal1Win = false;
            }
            if (this.getBoardPosition(i, boardSize - 1 - i) !== player) {
                diagonal2Win = false;  
            }
            if (!diagonal1Win && !diagonal2Win) {
                return false;
            }
        }
        return true;
    }

    private isBoardFull(): boolean {
        const { moveHistory } = this.state,
        { boardSize } = this.props;
        return moveHistory.length >= Math.pow(boardSize, boardSize);
    }
}
