export type Color = "W" | "B" | null;

export class Board {

    private board: Color[][];
    private toMove: Color = "B"
    private get blackMove() { return this.toMove === "B"; };

    public get boardSize() { return this._boardSize; };

    constructor(private _boardSize: number) {
        this.board = this.createBoard();
    }

    private createBoard() {
        const board: Color[][] = [];
        for (let i = 0; i < this._boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < this._boardSize; j++) {
                board[i][j] = null;
            }
        }
        return board;
    }

    public playMove(x: number, y: number) {
        if (this.board[x][y] !== null) {
            throw "Invalid move: Not empty.";
        }
        if (this.blackMove) {
            this.addBlack(x, y);
        } else {
            this.addWhite(x, y);
        }
        this.removeStones(x, y, this.toMove);
        if (!this.hasStoneLiberties(x, y)) {
            this.board[x][y] = null;
            throw "Invalid move: Suicide.";
        }
        this.playPass();
    }

    private hasStoneLiberties(x: number, y: number) {
        const tempBoard = this.createBoard();
        const curColor = this.board[x][y];
        return this.checkSuroundingStonesForLiberties(tempBoard, curColor, x, y);
    }

    private checkSuroundingStonesForLiberties(tempBoard: string[][], curColor: Color, x: number, y: number) {
        if (this.checkLineColmIsNotValid(x, y)) return false;
        if (this.board[x][y] === null) return true;
        if (this.board[x][y] !== curColor
            || tempBoard[x][y] !== null) return false;
        tempBoard[x][y] = "Done";
        if (this.checkSuroundingStonesForLiberties(tempBoard, curColor, x - 1, y)) return true;
        if (this.checkSuroundingStonesForLiberties(tempBoard, curColor, x + 1, y)) return true;
        if (this.checkSuroundingStonesForLiberties(tempBoard, curColor, x, y - 1)) return true;
        if (this.checkSuroundingStonesForLiberties(tempBoard, curColor, x, y + 1)) return true;

    }

    public getPrintBoard() {
        return `   ${this.board[0].reduce((prev, cur, idx) => `${prev}${(idx + 1) % 10}`, "")}
${this.board.reduce((prevLine, curLine, idx) =>
            `${prevLine}\n${("  " + (idx + 1)).slice(-2)} ${curLine.reduce((prev, cur) =>
                `${prev}${this.colorToString(cur)}`, ""
            )}`, ""
        )}`;
    }

    private colorToString(color: string) {
        if (color) return color;
        return ".";
    }

    public playPass() {
        this.toMove = this.reverseColor(this.toMove);
    }

    private reverseColor(color: Color): Color {
        return color === "W" ? "B" : "W";
    }

    public addWhite(x: number, y: number) {
        this.addStone(x, y, "W");
    }

    public addBlack(x: number, y: number) {
        this.addStone(x, y, "B");
    }

    public addStone(x: number, y: number, color: Color) {
        this.board[x][y] = color;
    }

    private removeStones(x: number, y: number, placeColor: Color) {
        const removeColor = this.reverseColor(placeColor);
        const tempBoard = this.createBoard();
        this.markSuroundingStones(tempBoard, removeColor, x, y);
        this.RemoveSuroundingMarkedStones(tempBoard, removeColor, x, y);
    }

    private checkLineColmIsNotValid(x: number, y: number) {
        return [x, y].some((e) => e < 0 || e >= this._boardSize);
    }

    // remove stones:
    // step 1: Tag all adjecting stones "T" (if they are untagged and of color removeColor).
    // step 2: If adjecting stone has liberty, tag all adjecting stones "F" (if they are untagged or tagged 1 and of color removeColor).
    // step 3: Remove all stones still tagged "T".

    private markStones(tempBoard: string[][], removeColor: Color, x: number, y: number) {
        if (this.checkLineColmIsNotValid(x, y)
            || tempBoard[x][y] !== null
        ) return;
        if (this.board[x][y] === null) {
            this.markSuroundingStonesWithLiberties(tempBoard, removeColor, x, y);
            return;
        }
        if (this.board[x][y] !== removeColor) return;
        tempBoard[x][y] = "T";
        this.markSuroundingStones(tempBoard, removeColor, x, y);
    }

    private markSuroundingStones(tempBoard: string[][], removeColor: Color, x: number, y: number) {
        this.markStones(tempBoard, removeColor, x - 1, y);
        this.markStones(tempBoard, removeColor, x + 1, y);
        this.markStones(tempBoard, removeColor, x, y - 1);
        this.markStones(tempBoard, removeColor, x, y + 1);
    }

    private markStonesWithLiberties(tempBoard: string[][], removeColor: Color, x: number, y: number) {
        if (this.checkLineColmIsNotValid(x, y)
            || (this.board[x][y] !== removeColor || this.board[x][y] === null)
            || (tempBoard[x][y] !== null && tempBoard[x][y] !== "T")
        ) return;
        tempBoard[x][y] = "F";
        this.markSuroundingStonesWithLiberties(tempBoard, removeColor, x, y);
    }

    private markSuroundingStonesWithLiberties(tempBoard: string[][], removeColor: Color, x: number, y: number) {
        this.markStonesWithLiberties(tempBoard, removeColor, x - 1, y);
        this.markStonesWithLiberties(tempBoard, removeColor, x + 1, y);
        this.markStonesWithLiberties(tempBoard, removeColor, x, y - 1);
        this.markStonesWithLiberties(tempBoard, removeColor, x, y + 1);
    }

    private RemoveMarkedStones(tempBoard: string[][], removeColor: Color, x: number, y: number) {
        if (this.checkLineColmIsNotValid(x, y)
            || this.board[x][y] !== removeColor
            || tempBoard[x][y] !== "T"
        ) return;
        this.board[x][y] = null;
        this.RemoveSuroundingMarkedStones(tempBoard, removeColor, x, y);
    }

    private RemoveSuroundingMarkedStones(tempBoard: string[][], removeColor: Color, x: number, y: number) {
        this.RemoveMarkedStones(tempBoard, removeColor, x - 1, y);
        this.RemoveMarkedStones(tempBoard, removeColor, x + 1, y);
        this.RemoveMarkedStones(tempBoard, removeColor, x, y - 1);
        this.RemoveMarkedStones(tempBoard, removeColor, x, y + 1);
    }
}

