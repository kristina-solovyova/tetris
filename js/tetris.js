const SQUARE_SIZE = 30;
const COL_NUM = 10;
const ROW_NUM = 20;
const GAME_DELAY = 500;
const MIN_DELAY = 250;
const DEFAULT_COLOR = 'white';
const FIGURE_MAX_SIZE = 4;
const DIRECTIONS = {
    left: {x: -1, y: 0},
    right: {x: 1, y: 0},
    down: {x: 0, y: 1}
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
        this.nextFigure = new Figure(this.playingField, nextFigureContext, true);
        this.score = new Score(username);
    }

    init() {
        this.drawPlayingField();
        this.drawNextFigureField();
        this.currentFigure.draw();
        this.nextFigure.draw();
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
        let isMoved = this.currentFigure.move(DIRECTIONS.down);
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
            this.updateFigures();
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

    updateFigures() {
        this.nextFigure.erase();
        this.nextFigure.context = context;
        this.nextFigure.makeCurrent();
        this.currentFigure = this.nextFigure;
        this.nextFigure = new Figure(this.playingField, nextFigureContext, true);
        this.nextFigure.draw();
    }

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

    static generatePlayingField() {
        let field = [];
        for (let i = 0; i < ROW_NUM; i++) {
            field[i] = new Array(COL_NUM).fill(0);
        }

        return field;
    }

    drawNextFigureField() {
        for (let i = 0; i < FIGURE_MAX_SIZE; i++) {
            for (let j = 0; j < FIGURE_MAX_SIZE; j++) {
                drawSquare(j, i, DEFAULT_COLOR, nextFigureContext)
            }
        }
    }

    handleKeydown(event) {
        if (event.key in Object.values(ACTIONS)) {
            event.preventDefault();
        }

        switch (event.key) {
            case ACTIONS.left:
                this.currentFigure.move(DIRECTIONS.left);
                break;
            case ACTIONS.right:
                this.currentFigure.move(DIRECTIONS.right);
                break;
            case ACTIONS.down:
                this.currentFigure.move(DIRECTIONS.down);
                break;
            case ACTIONS.up:
                this.currentFigure.rotate();
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
