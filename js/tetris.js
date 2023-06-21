const SQUARE_SIZE = 30;
const COL_NUM = 25;
const ROW_NUM = 30;
const GAME_DELAY = 500;
const MIN_DELAY = 250;
const DEFAULT_COLOR = 'white';
const FIGURE_MAX_SIZE = 4;
const DIRECTIONS = {
    left: {x: -1, y: 0},
    right: {x: 1, y: 0},
    down: {x: 0, y: 1},
    up: {x: 0, y:-1},
    stop: {x: 0, y: 0}
};
const ACTIONS = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    down: 'ArrowDown',
    up: 'ArrowUp'
};

const canvas = document.getElementById('main_field');
const context = canvas.getContext('2d');
const nextFigureCanvas = document.getElementById('next_figure');
const nextFigureContext = nextFigureCanvas.getContext('2d');

class Game {
    constructor(username) {
        this.playingField = Game.generatePlayingField();
        this.currentFigure = new Figure(this.playingField, context);
        this.score = new Score(username);
    }

    init() {
        this.drawPlayingField();
        //this.drawNextFigureField();
        this.currentFigure.draw();
        //this.nextFigure.draw();
        this.score.displayRecords();
        this.delay = GAME_DELAY;
    }

    play() {
        this.timer = setInterval(() =>
            this.moveOn(), this.delay
        );
    }

    stop() {
        clearInterval(this.timer);
        this.drawPlayingField();
        this.score.save();
        document.removeEventListener("keydown", this.handleKeydown);
        alert('Game over');
    }

    moveOn() {
        let isMoved = this.currentFigure.move(this.currentFigure.directions);
        if (!isMoved) {
            this.nextStep();
        }
    }

    nextStep() {
        this.currentFigure.occupyPlayingField();
        this.changeScore();

        if (this.isOver()) {
            this.stop();
        } else {
            //this.updateFigures();
        }
    }

    isOver() {
        let bottomFigureY = this.currentFigure.getBottomColoredSquareY();
        return this.currentFigure.y + bottomFigureY <= 0;
    }

    changeScore() {
        let lines = this.getFullLines();
        if (lines > 0) {
            this.score.change(lines);
            this.score.display();
            this.speedUpTimer();
        }
        console.log(JSON.stringify(this.score));
    }

    speedUpTimer() {
        if (this.delay > MIN_DELAY) {
            clearInterval(this.timer);
            this.delay -= 50;
            this.play();
        }
    }
/*
    updateFigures() {
        this.nextFigure.erase();
        this.nextFigure.context = context;
        this.nextFigure.makeCurrent();
        this.nextFigure = new Figure(this.playingField, nextFigureContext, true);
        this.nextFigure.draw();
    }
*/
    getFullLines() {
        let fullLinesNum = 0;
        let startY = this.currentFigure.y;
        let endY = startY + this.currentFigure.topology.length;

        for (let i = startY; i < endY && startY >= 0 && i < this.playingField.length; i++) {
            let isFull = this.playingField[i].every(elem => elem > 0);
            if (isFull) {
                fullLinesNum ++;
                this.eraseRow(i);
            }
        }

        return fullLinesNum;
    }

    eraseRow(rowNum) {
        this.playingField.splice(rowNum, 1);
        this.playingField.unshift(new Array(COL_NUM).fill(0));
        this.drawPlayingField();
    }

    drawPlayingField() {
        for (let i = 0; i < ROW_NUM; i++) {
            for (let j = 0; j < COL_NUM; j++) {
                let color = (this.playingField[i][j] > 0) ?
                    colors[this.playingField[i][j] - 1] : DEFAULT_COLOR;
                drawSquare(j, i, color, context);
            }
        }
    }
    /*
        0 - empty
        1 - wall
        2 - food
    */
    static generatePlayingField() {
        let field = [];
        for (let i = 0; i < ROW_NUM; i++) {
            field[i] = new Array(COL_NUM).fill(0);
        }

        field[0][12] = 1
        field[1][2] = 1
        field[1][3] = 1
        field[1][4] = 1
        field[1][5] = 1
        field[1][7] = 1
        field[1][8] = 1
        field[1][9] = 1
        field[1][10] = 1
        field[1][12] = 1

        return field;
    }
/*
    drawNextFigureField() {
        for (let i = 0; i < FIGURE_MAX_SIZE; i++) {
            for (let j = 0; j < FIGURE_MAX_SIZE; j++) {
                drawSquare(j, i, DEFAULT_COLOR, nextFigureContext)
            }
        }
    }
*/
    handleKeydown(event) {
        if (Object.values(ACTIONS).includes(event.key)) {
            event.preventDefault();
        }

        switch (event.key) {
            case ACTIONS.left:
                this.currentFigure.directions = DIRECTIONS.left;
                break;
            case ACTIONS.right:
                this.currentFigure.directions = DIRECTIONS.right;
                break;
            case ACTIONS.down:
                this.currentFigure.directions = DIRECTIONS.down;
                break;
            case ACTIONS.up:
                this.currentFigure.directions = DIRECTIONS.up;
                break;
        }
    }
}

const username = getUsername();
document.getElementById("player").innerText = username;

const game = new Game(username);
game.init();
document.addEventListener("keydown", (event) => game.handleKeydown(event));
game.play();

function getUsername() {
    return localStorage.getItem("username");
}
