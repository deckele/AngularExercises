export interface GameManager {
    move: {(x: number, y: number): void};
}

export interface GameProps {
    readonly player1: Readonly<Player>;
    readonly player2: Readonly<Player>;
    readonly boardSize: number;
}

export interface Player {
    name: string;
    symbolIdentifier: string;
}

export interface GameState {
    board: string[][];
    currentPlayerSymbol: string;
    moveHistory: Move[];
    endGameStatus: EndGameStatus;
}

export enum EndGameStatus {
    InProgress = 0,
    Player1Winner = 1,
    Player2Winner = 2,
    Draw = 3
}

export type Move = [number, number];
