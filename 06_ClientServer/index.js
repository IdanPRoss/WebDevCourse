const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// static folder is client folder
app.use(express.static(path.join(__dirname, "client"), { index: "home.html", }));

let songs = [
    { id: 1, title: "Song A", artist: "Artist 1", duration: 1.8 },
    { id: 2, title: "Song B", artist: "Artist 2", duration: 2.0 },
    { id: 3, title: "Song C", artist: "Artist 3", duration: 2.4 }
];

app.get("/songs", (req, res) => {
    res.json(songs);   // <-- returns JSON
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
})

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
