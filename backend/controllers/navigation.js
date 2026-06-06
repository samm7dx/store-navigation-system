const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../data/storeLayout.json');

const getStoreLayout = () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

exports.findRoute = (req, res) => {
    const { start, end } = req.body;
    
    if (!start || !end || start.length !== 2 || end.length !== 2) {
        return res.status(400).json({ error: 'Invalid start or end coordinates' });
    }

    let grid;
    try {
        grid = getStoreLayout();
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read store layout' });
    }

    const rows = grid.length;
    const cols = grid[0].length;

    let inputString = `${rows} ${cols}\n`;
    for (let r = 0; r < rows; r++) {
        inputString += grid[r].join(' ') + '\n';
    }
    inputString += `${start[0]} ${start[1]}\n`;
    inputString += `${end[0]} ${end[1]}\n`;

    const mode = process.env.ALGORITHM_MODE || 'cpp';
    
    let execCommand;
    let execArgs = [];
    
    if (mode === 'js') {
        execCommand = 'node';
        execArgs = [path.join(__dirname, '../../algorithm/dijkstra.js')];
    } else {
        const isWindows = process.platform === 'win32';
        const execName = isWindows ? 'dijkstra.exe' : 'dijkstra';
        execCommand = path.join(__dirname, '../../algorithm', execName);
        
        if (!fs.existsSync(execCommand)) {
             // Silently fallback to JS if executable is missing to prevent crash
             execCommand = 'node';
             execArgs = [path.join(__dirname, '../../algorithm/dijkstra.js')];
        }
    }

    const child = spawn(execCommand, execArgs);
    let outputData = '';
    let errorData = '';

    child.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    child.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    child.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Algorithm execution failed', details: errorData });
        }
        
        try {
            const result = JSON.parse(outputData);
            result.mode = mode === 'js' ? 'js' : 'cpp';
            res.json(result);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to parse algorithm output', details: err.toString() });
        }
    });

    child.stdin.write(inputString);
    child.stdin.end();
};
