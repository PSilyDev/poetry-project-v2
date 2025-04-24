const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors())

// load poems from json

let poemsData = {};

try{
    const data = fs.readFileSync('./poems.json', 'utf-8');
    poemsData = JSON.parse(data);
} catch (err){
    console.log('Error reading poems.json: ', err);
}

// API endpoint to get all the authors
app.get('/api/authors', (req, res) => {
    res.json(Object.keys(poemsData));
});

// API endpoint to get poems by the author
app.get('/api/poems/:author', (req, res) => {
    const author = req.params.author;

    if (!poemsData[author]) {
        return res.status(404).json({ error: 'Author not found' });
    }
    console.log('data passed from backend - ', poemsData[author]);
    res.json(poemsData[author]);

})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});