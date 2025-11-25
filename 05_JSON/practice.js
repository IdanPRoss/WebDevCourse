
let song1 = {
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "duration": 233,
    "genre": "Pop"
}

// deep clone
let song2 = Object.assign({}, song1);
let { title, duration } = song2;

for (let key in song1) {
    console.log(`${key}: ${song1[key]}`);
}


let playlist = {
    playlistName: "My Favorites",
    createdBy: "John",
    songs: [
        { title: "Shape of You", artist: "Ed Sheeran", duration: 233 },
        { title: "Blinding Lights", artist: "The Weeknd", duration: 200 }
    ]
}

let addSong = { title: "Shape of You", artist: "Ed Sheeran", duration: 233 };
playlist.songs.push(addSong);

// Iterate and print song titles
// this is callback
playlist.songs.forEach(song => {
    console.log(`Title: ${song.title}, Artist: ${song.artist}`);
})


// converts object to string
const jsonText = JSON.stringify(playlist);
// converts text to object
const playlist2 = JSON.parse(jsonText);

//save the playlist text as key in browser client local storage
localStorage.setItem("playlist", jsonText);
let storageText = localStorage.getItem("playlist");
const playlist3 = JSON.parse(storageText);
