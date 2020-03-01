import { Board, Color } from "./board";

export class DemoBoard {
    private sampleGame: string[][][] = [];

    constructor() {
        this.sampleGame[9] = `
..BBW...W
BBBBWWWWW
BBBBWBB.W
WWWWWWWWW
.........
.........
WWWW.....
BBBWW....
.B.BW....`.substr(1).split("\n").map(line => line.split(""));
    }

    preFillBoard(board: Board) {
        const demoBoard = this.sampleGame[board.BoardSize];
        if (!demoBoard) return;
        demoBoard.forEach((line, x) => {
            line.forEach((color, y) => {
                if (color === ".") {
                    board.addStone(x, y, null);
                } else {
                    board.addStone(x, y, color as Color);
                }
            });
        }
        );
    }
}