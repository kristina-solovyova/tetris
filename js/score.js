const MAX_RECORDS_NUM = 12;
const POINTS = {
    1: 100, 2: 300, 3: 700, 4: 1500
};

class Score {
    constructor(player) {
        this.player = player;
        this.points = 0;
        this.lines = 0;
        this.records = this.getRecords();
    }

    change(lines) {
        this.lines += lines;
        this.points += POINTS[lines];
    }

    save() {
        this.records.push({
            player: this.player,
            points: this.points,
            lines: this.lines
        });
        this.records.sort((a, b) => b.points - a.points);
        this.records.length = MAX_RECORDS_NUM;
        this.setRecords();
        this.displayRecords();
    }

    setRecords() {
        localStorage.setItem("records", JSON.stringify(this.records));
    }

    getRecords() {
        let records = localStorage.getItem("records");
        if (records != null) {
            return JSON.parse(records);
        }
        return [];
    }

    displayRecords() {
        const oldTable = document.getElementById("scores").tBodies.item(0);
        const newTable = document.createElement('tbody');

        this.records.forEach((record) => {
            let tr = document.createElement("tr");
            Object.keys(record).forEach((key) => {
                let td = document.createElement("td");
                td.innerText = record[key];
                tr.appendChild(td);
            });

            newTable.appendChild(tr);
        });
        oldTable.parentNode.replaceChild(newTable, oldTable);
    }

    display() {
        document.getElementById("score").innerText = this.points;
    }
}
