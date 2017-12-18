import Game from "./game-manager";
import Player from "./player";

const game = new Game(3, 3);

game.addPlayer(new Player("Wonder Woman", "X"));
game.addPlayer(new Player("Wonder Man", "O"));

game.board.print();

console.log(game.status);
game.printSummary();

game.nextMove(0,0);
game.nextMove(0,0);
game.nextMove(1,1);
game.nextMove(0,2);
game.nextMove(2,2);
game.nextMove(0,1);
game.nextMove(2,1);

game.board.print();

game.printSummary();
