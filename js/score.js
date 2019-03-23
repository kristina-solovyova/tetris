const POINTS = {
    1: 100, 2: 300, 3: 700, 4: 1500
};

class Score {
    constructor(player) {
        this.player = player;
        this.points = 0;
        this.lines = 0;
    }

    change(lines) {
        this.lines += lines;
        this.points += POINTS[lines];
    }
}