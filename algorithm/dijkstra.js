const fs = require('fs');

const stdinBuffer = fs.readFileSync(0); // Synchronously read all of stdin
const input = stdinBuffer.toString().trim().split(/\s+/);

if (input.length < 2) {
    console.log(JSON.stringify({ error: "Invalid input" }));
    process.exit(1);
}

const rows = parseInt(input[0]);
const cols = parseInt(input[1]);

let grid = [];
let idx = 2;
for (let i = 0; i < rows; i++) {
    let rowData = [];
    for (let j = 0; j < cols; j++) {
        rowData.push(parseInt(input[idx++]));
    }
    grid.push(rowData);
}

const startR = parseInt(input[idx++]);
const startC = parseInt(input[idx++]);
const endR = parseInt(input[idx++]);
const endC = parseInt(input[idx++]);

if (startR < 0 || startR >= rows || startC < 0 || startC >= cols ||
    endR < 0 || endR >= rows || endC < 0 || endC >= cols) {
    console.log(JSON.stringify({ error: "Coordinates out of bounds" }));
    process.exit(1);
}

let distArray = Array.from({length: rows}, () => Array(cols).fill(Infinity));
let visited = Array.from({length: rows}, () => Array(cols).fill(false));
let parentRow = Array.from({length: rows}, () => Array(cols).fill(-1));
let parentCol = Array.from({length: rows}, () => Array(cols).fill(-1));

let dRow = [-1, 1, 0, 0];
let dCol = [0, 0, -1, 1];

distArray[startR][startC] = 0;
let nodesVisited = 0;

for (let count = 0; count < rows * cols; count++) {
    let minD = Infinity;
    let uR = -1, uC = -1;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j] && distArray[i][j] < minD) {
                minD = distArray[i][j];
                uR = i;
                uC = j;
            }
        }
    }

    if (uR === -1 || uC === -1) break;

    visited[uR][uC] = true;
    nodesVisited++;

    if (uR === endR && uC === endC) break;

    for (let i = 0; i < 4; i++) {
        let nR = uR + dRow[i];
        let nC = uC + dCol[i];

        if (nR >= 0 && nR < rows && nC >= 0 && nC < cols) {
            if (!visited[nR][nC] && grid[nR][nC] === 0) {
                if (distArray[uR][uC] + 1 < distArray[nR][nC]) {
                    distArray[nR][nC] = distArray[uR][uC] + 1;
                    parentRow[nR][nC] = uR;
                    parentCol[nR][nC] = uC;
                }
            }
        }
    }
}

let totalDistance = distArray[endR][endC];
let path = [];

if (totalDistance !== Infinity) {
    let cR = endR;
    let cC = endC;
    while (cR !== -1 && cC !== -1) {
        path.push([cR, cC]);
        let pR = parentRow[cR][cC];
        let pC = parentCol[cR][cC];
        cR = pR;
        cC = pC;
    }
}

path.reverse();

const result = {
    distance: totalDistance === Infinity ? -1 : totalDistance,
    nodesVisited: nodesVisited,
    path: path
};

console.log(JSON.stringify(result, null, 2));
