import chalk from "chalk";
import figlet from "figlet";
import clear from "clear";
import { askUserData, askToPlay, askWherePlay, askWhoToPlay } from "./input";
import { Board } from "./board";
import { DemoBoard } from "./demoBoard";

const run = async () => {
    clear();
    console.log();
    console.log(
        chalk.yellow(
            figlet.textSync("Go board command line", {
                verticalLayout: "default",
                horizontalLayout: "default"
            })
        )
    );

    const { boardsize } = await askUserData();
    const board = new Board(boardsize);
    const demoBoard = new DemoBoard();

    playLoop:

    for (; ;) {
        console.log(board.getPrintBoard());
        const answer = await askToPlay();
        switch (answer.action) {
            case "Pass": {
                board.playPass();
                break;
            }
            case "Play": {
                for (; ;) {
                    try {
                        const { x, y } = await askWherePlay(boardsize);
                        board.playMove(x, y);
                        break;
                    } catch (e) {
                        console.log(e);
                    }
                }
                break;
            }
            case "Place": {
                const { color } = await askWhoToPlay();
                const { x, y } = await askWherePlay(boardsize);
                board.addStone(x, y, color);
                break;
            }
            case "Demo": {
                demoBoard.preFillBoard(board);
                break;
            }
            default: {  // quit
                break playLoop;
            }
        }
    }
};

run();