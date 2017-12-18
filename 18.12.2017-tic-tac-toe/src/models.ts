import Player from "./player";

export type Move = [number, number];

export interface GameManager {
    nextMove: {(x: number, y: number): void};
}

export interface GameState {
    currentPlayerTurnIndex: number;
    moveHistory: Move[];
    endGameStatus: EndGameStatus;
    players: Player[];
    endGameMessage: string;
}

export enum EndGameStatus {
    InProgress,
    Completed
}
