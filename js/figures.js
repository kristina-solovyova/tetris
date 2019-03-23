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

const topologies = {Z, S, J, T, L, I, O};
const colors = ["red", "orange", "yellow", "green", "cyan", "blue", "darkOrchid"];
const tetraminos = assignColorsToTopologies();
const angles = [0, 90, 180, 270];

class Figure {
    constructor(playingField, topology, color, x, y) {
        this.playingField = playingField;

        if (arguments.length < 2) {
            this.generateRandom();
            return;
        }

        this.topology = topology;
        this.color = color;
        this.x = x;
        this.y = y;
    }

    drawElement(element, j, i, color) {
        if (element > 0) {
            drawSquare(this.x+j, this.y+i, color);
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
                if (element > 0) {
                    this.playingField[this.y+i][this.x+j] = 1;
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
                        || newY+y >= this.playingField.length)) {
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
            //TODO: починить
            this.topology = newTopology;
        }
    }

    generateRandom() {
        let tetramino = getRandomTetramino();
        this.topology = tetramino.topology;
        this.color = tetramino.color;
        this.x = 3;
        this.y = -2; //TODO: fix this shit!
    }
}

function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x*SQUARE_SIZE,y*SQUARE_SIZE,SQUARE_SIZE,SQUARE_SIZE);
    context.strokeStyle = "black";
    context.strokeRect(x*SQUARE_SIZE,y*SQUARE_SIZE,SQUARE_SIZE,SQUARE_SIZE);
}

function assignColorsToTopologies() {
    let tetraminos = {};
    Object.keys(topologies).forEach((key, ind) => {
        tetraminos[key] = {
            topology: topologies[key],
            color: colors[ind]
        };
    });

    return tetraminos;
}

function getRandomAngle() {
    return angles[Math.floor(Math.random()*angles.length)];
}

function getRandomTetramino() {
    let keys = Object.keys(tetraminos);
    let key = keys[Math.floor(Math.random()*keys.length)];

    return tetraminos[key];
}

function rotateFigure(figure) {
    figure = [...figure].reverse();
    return figure[0].map((column, index) => (
        figure.map(row => row[index])
    ));
}

