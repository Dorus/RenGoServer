import inquirer from "inquirer";

export function askUserData(): Promise<{ name: string; boardsize: number }> {
    const questions = [
        {
            name: "boardsize",
            type: "input",
            message: "What boardsize would you like?",
            validate: function (value: string) {
                return checkNumber(value, (i) => {
                    if (!(i >= 5)) {
                        return "Please enter at least 5";
                    }
                    if (!(99 >= i)) {
                        return "Please enter at most 99";
                    }
                    return true;
                });
            }
        }
    ];
    return inquirer.prompt(questions);
}

function checkNumber(value: string, fun: (input: number) => string | boolean) {
    const i = Number(value);
    if (i) {
        return fun(i);
    } else {
        return "Please an number";
    }
}

export function askToPlay(): Promise<{ action: "Play" | "Pass" | "Place" | "Demo" | "Quit" }> {
    const questions = [
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                { name: "Play a move", value: "Play" },
                "Pass",
                { name: "Place a stone", value: "Place" },
                { name: "Fill demo board", value: "Demo" },
                "Quit"]
        }
    ];
    return inquirer.prompt(questions);
}

export function askWhoToPlay(): Promise<{ color: "B" | "W" | null }> {
    const questions = [
        {
            name: "color",
            type: "list",
            message: "What color?",
            choices: [
                { name: "Black", value: "B" },
                { name: "White", value: "W" },
                { name: "Empty", value: null }
            ]
        }
    ];
    return inquirer.prompt(questions);
}

export async function askWherePlay(boardSize: number): Promise<{ x: number; y: number }> {
    const questions = [
        {
            name: "y",
            type: "input",
            message: "Give horizontral offset",
            validate: function (value: string) {
                return checkNumber(value, i => {
                    if (1 <= i && i <= boardSize) {
                        return true;
                    } else {
                        return `Please enter a number between 0 and ${boardSize}`;
                    }
                });
            }
        },
        {
            name: "x",
            type: "input",
            message: "Give vertical offset",
            validate: function (value: string) {
                return checkNumber(value, i => {
                    if (1 <= i && i <= boardSize) {
                        return true;
                    } else {
                        return `Please enter a number between 0 and ${boardSize}`;
                    }
                });
            }
        }
    ];
    const { x, y } = await inquirer.prompt(questions);
    return { x: x - 1, y: y - 1 };
}
