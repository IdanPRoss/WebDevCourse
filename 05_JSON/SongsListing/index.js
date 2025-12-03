// script.js

// Get HTML DOM Element references 
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');

// --- NEW TOGGLE VIEW VARIABLES ---
const toggleViewBtn = document.getElementById('toggleViewBtn');
const mainTable = document.getElementById('mainTable');
const cardContainer = document.getElementById('cardContainer');
let isTableView = true; // Default state

// --- ADD EVENT LISTENER FOR TOGGLE BUTTON ---
if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', () => {
        isTableView = !isTableView; // Switch state

        // Update Icon
        const icon = toggleViewBtn.querySelector('i');
        if (isTableView) {
            icon.className = 'fas fa-th-large';
        } else {
            icon.className = 'fas fa-list';
        }

        // Re-render
        // Check if there is a search term active to decide what to render
        const searchTerm = document.getElementById('search').value.toLowerCase();
        if (searchTerm) {
            const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(searchTerm));
            renderSongs(filteredSongs);
        } else {
            renderSongs(songs);
        }
    });
}

let songs = [];

// YOUTUBE API (Auto Title) 
const API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';

async function fetchVideoTitle(videoId) {
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.items.length === 0) return null;

        return data.items[0].snippet.title;

    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// This runs automatically when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('playlist');
    if (storedData) {
        // If yes, turn the JSON string back into an Array
        songs = JSON.parse(storedData);
    } else {
        // If no, start with an empty array
        songs = [];
    }
    // This ensures the table is populated as soon as the script runs
    renderSongs(songs);
});



// user click the "+ADD" btn 
form.addEventListener('submit', async (e) => {
    // dont submit the form to the server yet, let me handle it here
    e.preventDefault();

    // read forms data
    let title = document.getElementById('title').value; // 'let' because we might change it
    const url = document.getElementById('url').value;
    const rating = Number(document.getElementById('rating').value);
    const id = document.getElementById('songId').value; // Check for hidden ID

    //TODO VALITADE FIELDS
    if (rating < 1 || rating > 10) {
        alert("Rating must be between 1 and 10");
        return;
    }

    const videoId = getYouTubeID(url);
    const thumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : 'https://via.placeholder.com/120x90?text=No+Image';

    if (!videoId) {
        alert("Please enter a valid YouTube URL");
        return;
    }


    // Only fetch if we are Adding (no ID) AND the user didn't type a title
    if (!id && !title) {
        // UX: Show the user we are working
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';

        // PAUSE HERE while we talk to Google
        const apiTitle = await fetchVideoTitle(videoId);

        // If API works, use that title. If not, use a fallback.
        title = apiTitle || "Unknown Video";

        // UX: Reset button
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    }

    // Fallback if title is still empty
    if (!title) title = "Untitled Track";

    // create json obj base on url title
    if (id) {
        // --- UPDATE MODE ---
        const index = songs.findIndex(s => s.id == id);
        songs[index].title = title;
        songs[index].url = url;
        songs[index].rating = rating;
        songs[index].thumbnail = thumbnail;

        // Reset Button UI
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');
        document.getElementById('songId').value = '';

    } else {
        // --- ADD MODE ---
        const song = {
            id: Date.now(),  // Unique ID
            title: title,
            url: url,
            rating: rating,
            thumbnail: thumbnail,
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();
    form.reset();
});

// Search Functionality
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    // Create a temporary array of matches
    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm)
    );

    renderSongs(filteredSongs); // Render only matches
});

document.querySelectorAll('input[name="sortOptions"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const sortBy = document.querySelector('input[name="sortOptions"]:checked').value;

        if (sortBy === 'name') songs.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortBy === 'date') songs.sort((a, b) => b.dateAdded - a.dateAdded);
        else if (sortBy === 'rating') songs.sort((a, b) => b.rating - a.rating);

        saveAndRender();
    });
});

// Save to local storage and render UI table
function saveAndRender() {
    localStorage.setItem('playlist', JSON.stringify(songs));
    renderSongs(songs);
}


function renderSongs(songArray) {
    list.innerHTML = ''; // Clear current list
    cardContainer.innerHTML = '';

    if (isTableView) {
        mainTable.classList.remove('d-none');
        cardContainer.classList.add('d-none');

        songArray.forEach(song => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${song.thumbnail}" alt="${song.title}" width="120" height="90" style="object-fit:cover"></td>
                <td class="align-middle">${song.title}</td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-outline-info" onclick="playVideo('${getYouTubeID(song.url)}')">
                        <i class="fas fa-play"></i> Watch
                    </button>
                </td>
                <td class="align-middle">${song.rating}</td>
                <td class="text-end align-middle">
                    <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            list.appendChild(row);
        });

    } else {
        mainTable.classList.add('d-none');
        cardContainer.classList.remove('d-none');

        songArray.forEach(song => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4'; // ריספונסיבי: 2 בשורה בטאבלט, 3 בשורה בדסקטופ

            col.innerHTML = `
                <div class="card h-100 bg-secondary border-primary">
                    <div class="ratio ratio-16x9">
                         <img src="${song.thumbnail}" class="card-img-top" alt="${song.title}" style="object-fit:cover; cursor:pointer" onclick="playVideo('${getYouTubeID(song.url)}')">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-white text-truncate" title="${song.title}">${song.title}</h5>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="badge bg-primary">Rating: ${song.rating}</span>
                                <button class="btn btn-sm btn-info rounded-circle" onclick="playVideo('${getYouTubeID(song.url)}')">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                            <div class="btn-group w-100">
                                <button class="btn btn-warning" onclick="editSong(${song.id})"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn btn-danger" onclick="deleteSong(${song.id})"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.appendChild(col);
        });
    }
}

function deleteSong(id) {
    if (confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

function editSong(id) {
    // Find the song object
    const songToEdit = songs.find(song => song.id === id);

    if (songToEdit) {
        document.getElementById('title').value = songToEdit.title;
        document.getElementById('url').value = songToEdit.url;
        document.getElementById('rating').value = songToEdit.rating || '';
        document.getElementById('songId').value = songToEdit.id; // Set Hidden ID

        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
        submitBtn.classList.replace('btn-success', 'btn-warning');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateSong(id, title, url, rating, thumbnail) {
    // Find index of the song
    const index = songs.findIndex(song => song.id == Number(id));

    if (index !== -1) {
        if (!thumbnail || thumbnail.includes('via.placeholder.com')) {
            const videoId = getYouTubeID(url);
            thumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : 'https://via.placeholder.com/120x90?text=No+Image';
        }

        songs[index].title = title;
        songs[index].url = url;
        songs[index].rating = rating;
        songs[index].thumbnail = thumbnail;

        saveAndRender(); // Save updated array to storage
        // Reset form UI is handled in the submit event listener
    }
    /*
    document.getElementById('songId').value = '';
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    submitBtn.classList.replace('btn-warning', 'btn-success');
    */
}

function playVideo(videoId) {
    if (!videoId) {
        alert("Invalid YouTube URL");
        return;
    }
    const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const frame = document.getElementById('videoFrame');
    const modalElement = document.getElementById('videoModal');

    // Set the source to the YouTube Embed URL (autoplay=1 makes it start immediately)
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    // Initialize and Show Bootstrap Modal
    // (We use 'window.bootstrap' because we loaded the CDN)
    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();
}


// We listen for the Bootstrap specific event 'hidden.bs.modal'
const videoModal = document.getElementById('videoModal');
videoModal.addEventListener('hidden.bs.modal', () => {
    const frame = document.getElementById('videoFrame');
    frame.src = ''; // Wipes the source, stopping the audio
});
