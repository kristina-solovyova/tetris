const Z = [[1, 1, 0],
           [0, 1, 1],
           [0, 0, 0]];
const S = [[0, 1, 1],
           [1, 1, 0],
           [0, 0, 0]];
const J = [[0, 1, 0],
           [0, 1, 0],
           [1, 1, 0]];
const T = [[0, 0, 0],
           [1, 1, 1],
           [0, 1, 0]];
const L = [[0, 1, 0],
           [0, 1, 0],
           [0, 1, 1]];
const I = [[0, 0, 0, 0],
           [1, 1, 1, 1],
           [0, 0, 0, 0],
           [0, 0, 0, 0]];
const O = [[0, 0, 0, 0],
           [0, 1, 1, 0],
           [0, 1, 1, 0],
           [0, 0, 0, 0]];
const P = [[1]];

const yellow = "#faf32f";

const topologies = {Z, S, J, T, L, I, O, P};
const colors = ["#46bfee"];
// const colors = ["#e74c3c", "#ffa726", "#ffee58", "#58d68d", "#93f3ef", "#3498db", "#9b59b6"];
const tetraminos = assignColorsToTopologies();

class Figure {
    constructor(playingField, figureContext, isNext) {
        this.playingField = playingField;
        this.context = (figureContext == null) ? context : figureContext;
        this.topology = P;
        this.color = yellow;
        this.direction = DIRECTIONS.stop;
        this.x
        this.y

        if (isNext === true) {
            this.makeNext();
        } else {
            this.makeCurrent();
        }
    }

    drawElement(element, j, i, color) {
        if (element > 0) {
            drawSquare(this.x+j, this.y+i, color, this.context);
        }
    }

    draw() {
        this.topology.forEach((row, i) => {
            row.forEach((element, j) => {
                this.drawElement(element, j, i, this.color);
            });
        });
    }

    erase() {
        this.topology.forEach((row, i) => {
            row.forEach((element, j) => {
                this.drawElement(element, j, i, DEFAULT_COLOR);
            });
        });
    }

    occupyPlayingField() {
        this.topology.forEach((row, i) => {
            row.forEach((element, j) => {
                if (element > 0 && this.y+i >= 0) {
                    this.playingField[this.y+i][this.x+j] = colors.indexOf(this.color) + 1;
                }
            });
        });
    }

    move(direction) {
        if (this.checkFieldLimitations(direction)) {
            this.erase();
            this.x += direction.x;
            this.y += direction.y;
            this.draw();

            return true;
        }

        return false;
    }

    rotate() {
        this.erase();
        this.adjustRotation();
        this.draw();
    }

    checkFieldLimitations(direction, topology) {
        topology = (topology == null) ? this.topology : topology;
        let newX = this.x + (direction == null ? 0 : direction.x);
        let newY = this.y + (direction == null ? 0 : direction.y);

        for (let y = 0; y < topology.length; y++) {
            for (let x = 0; x < topology.length; x++) {
                if (topology[y][x] === 1 &&
                    (newX+x < 0 || newX+x >= this.playingField[0].length
                        || newY+y >= this.playingField.length || newY+y < 0)) {
                    return false;
                } else if (topology[y][x] === 1 &&
                    this.playingField[newY+y] !== undefined &&
                    this.playingField[newY+y][newX+x] > 0) {
                    return false;
                }
            }
        }

        return true;
    }

    adjustRotation() {
        let newTopology = rotateFigure(this.topology);
        if (this.checkFieldLimitations(null, newTopology)) {
            this.topology = newTopology;
        }
    }

    getBottomColoredSquareY() {
        for (let i = this.topology.length-1; i >= 0; i--) {
            if (this.topology[i].some(elem => elem > 0)) {
                return i;
            }
        }
    }

    makeCurrent() {
        this.x = 0;
        this.y = 0;
    }

    makeNext() {
        this.x = 0;
        this.y = 0;
    }
}

function drawSquare(x, y, color, context, bordercolor = "white") {
    context.fillStyle = color;
    context.fillRect(x*SQUARE_SIZE,y*SQUARE_SIZE,SQUARE_SIZE,SQUARE_SIZE);
    context.strokeStyle = bordercolor;
    context.strokeRect(x*SQUARE_SIZE,y*SQUARE_SIZE,SQUARE_SIZE,SQUARE_SIZE);
}


class Pacman extends Figure {
    constructor(playingField, figureContext, isNext) {
        super(playingField, figureContext, isNext);
        this.powered_up = false;
        this.lives = 3;
      }


      power_up() {
        return this.present() + ', it is a ' + this.model;
      }
}
