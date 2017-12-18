import { Move } from "../models";
type BoardState = string[][];

export default class Board {
    private state: BoardState;

    constructor(private readonly xSize: number = 3, private readonly ySize: number = 3) {
        this.resetBoard();
    }

    public getPosition([x, y]: Move): string {
        return this.state[x][y];
    }

    public setPosition([x, y]: Move, symbol: string) {
        this.state[x][y] = symbol;
    }
    
    public resetBoard() {
        const state: string[][] = [];
        for (let y = 0; y < this.ySize; y++) {
            state[y] = new Array(this.xSize);
        }

        this.state = state;
    }

    public isMoveOutOfBounds([x, y]: Move): boolean {
        return x >= this.xSize || y >= this.ySize;
    }

    public isMoveTaken([x, y]: Move): boolean {
        return !!this.getPosition([x, y]);
    }

    public isRowWin(currentPlayerSymbolId: string): boolean {
        const player = currentPlayerSymbolId;
        
        for (let y = 0; y < this.ySize; y++) {
            let rowWon = true;
            for (let x = 0; x < this.xSize; x++) {
                if (this.getPosition([x, y]) !== player) {
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

    public isColumnWin(currentPlayerSymbolId: string): boolean {
        const player = currentPlayerSymbolId;        
        
        for (let x = 0; x < this.xSize; x++) {
            let columnWon = true;
            for (let y = 0; y < this.ySize; y++) {
                if (this.getPosition([x, y]) !== player) {
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

    public isDiagonalWin(currentPlayerSymbolId: string): boolean {
        if (this.xSize !== this.ySize) {
            return false;
        }
        const boardSize = this.xSize;
        const player = currentPlayerSymbolId;
        let diagonal1Win = true,
        diagonal2Win = true;
        for (let i = 0; i < boardSize; i++) {
            if (this.getPosition([i, i]) !== player) {
                diagonal1Win = false;
            }
            if (this.getPosition([i, boardSize - 1 - i]) !== player) {
                diagonal2Win = false;  
            }
            if (!diagonal1Win && !diagonal2Win) {
                return false;
            }
        }
        return true;
    }

    public isBoardFull(sumOfMoves: number): boolean {
        return sumOfMoves >= this.xSize * this.ySize;
    }

    public print() {
        for (let y = 0; y < this.ySize; y++) {
            process.stdout.write("\n");
            if (y !== 0) {
                this.printLine(this.xSize * 2 - 1);
                process.stdout.write("\n");
            }
            for (let x = 0; x < this.xSize; x++) {
                if (x > 0) {
                    process.stdout.write("|");
                }
                process.stdout.write(this.state[x][y] || " ");
            }
        }
        process.stdout.write("\n\n");
    }

    private printLine(length: number) {
        process.stdout.write("\r");
        for (let i = 0; i < length; i++) {
            process.stdout.write("-");
        }
    }
}
