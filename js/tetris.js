const SQUARE_SIZE = 30;
const COL_NUM = 10;
const ROW_NUM = 20;
const DEFAULT_COLOR = 'white';
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

class Game {
    constructor() {
        this.playingField = Game.generatePlayingField();
        this.currentFigure = new Figure(this.playingField);
        this.nextFigure = new Figure(this.playingField);
        this.score = new Score('Jane');
    }

    init() {
        Game.drawPlayingField();
        this.currentFigure.draw();
    }

    play() {
        this.timer = setInterval(() =>
            this.moveOn(),500
        );
    }

    moveOn() {
        let isMoved = this.currentFigure.move(DIRECTIONS.down);
        if (!isMoved) {
            this.nextStep();
        }
    }

    nextStep() {
        this.currentFigure.occupyPlayingField();
        this.currentFigure = this.nextFigure;
        this.nextFigure = new Figure(this.playingField);
    }

    static drawPlayingField() {
        for (let i = 0; i < ROW_NUM; i++) {
            for (let j = 0; j < COL_NUM; j++) {
                drawSquare(j, i, DEFAULT_COLOR);
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

const game = new Game();
game.init();
document.addEventListener("keydown", (event) => game.handleKeydown(event));
game.play();
