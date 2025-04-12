const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

//Enable Express to parse JSON bodies
app.use(express.json());
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// Serve exerciseMaster.json
app.get('/exerciseMaster.json', (req, res) => {
    fs.readFile(path.join(__dirname, 'exerciseMaster.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading exerciseMaster.json' });
        }
        res.json(JSON.parse(data));
    });
});

// Serve log.json
app.get('/log.json', (req, res) => {
    fs.readFile(path.join(__dirname, 'log.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading exerciseMaster.json' });
        }
        res.json(JSON.parse(data));
    });
});

// Handle POST request to save log.json
app.post('/log.json', (req, res) => {
    const updatedLog = req.body;

    fs.writeFile(path.join(__dirname, 'log.json'), JSON.stringify(updatedLog, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving log.json' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});