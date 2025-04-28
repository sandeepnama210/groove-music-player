console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs = [];
let albums = []; // Stores albums { title, folder }
let currFolder;
let currentSongIndex = 0;

// Convert seconds to MM:SS format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Elements
let searchInput = document.querySelector('.search-input');
let songListContainer = document.querySelector('.songList ul');

// Helper to reset all songs to Play Now
function resetSongListToPlayNow() {
    Array.from(songListContainer.getElementsByTagName("li")).forEach((el) => {
        const playnowSpan = el.querySelector(".playnow span");
        const playnowImg = el.querySelector(".playnow img");
        playnowSpan.innerText = "Play Now";
        playnowImg.src = "img/play.svg"; // Reset to Play icon
    });
}

// Get all folders (albums) from /songs/
async function getAllFolders() {
    let res = await fetch('/songs/');
    let text = await res.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a");

    let folders = [];
    for (let a of anchors) {
        if (a.href.includes("/songs/") && !a.href.includes(".htaccess")) {
            let folder = a.href.split("/").filter(Boolean).pop();
            folders.push(folder);
        }
    }
    return folders;
}

// Get songs from a specific folder
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/songs/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    // Show all songs in the playlist
    songListContainer.innerHTML = "";
    for (const song of songs) {
        songListContainer.innerHTML += `<li><img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${decodeURI(song.replaceAll("%20", " "))}</div>
                <div>Unknown Artist</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt=""/>
            </div> </li>`;
    }

    // Reset all icons to Play Now by default
    resetSongListToPlayNow();

    // Attach event listener to each song
    Array.from(songListContainer.getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            if (currentSongIndex === index && !currentSong.paused) {
                // If same song clicked and it's playing, pause it
                currentSong.pause();
                play.src = "img/play.svg";
                resetSongListToPlayNow();
            } else {
                currentSongIndex = index;
                playMusic(songs[index]);
                resetSongListToPlayNow();
                updatePlayPauseIcon(index);
            }
        });
    });

    console.log("Loaded folder:", folder);
    console.log("Songs:", songs);
    return songs;
}

// Update play/pause icon for the clicked song
function updatePlayPauseIcon(index) {
    const songListItems = Array.from(songListContainer.getElementsByTagName("li"));
    const playnowSpan = songListItems[index].querySelector(".playnow span");
    const playnowImg = songListItems[index].querySelector(".playnow img");
    playnowSpan.innerText = "Pause";
    playnowImg.src = "img/pause.svg"; // Change to Pause icon for current song
}

// Play selected song
const playMusic = (track, pause = false) => {
    currentSong.src = `/songs/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    } else {
        play.src = "img/play.svg"; // If loading without playing, keep play icon
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    // Update "Now Playing" above song list
    const nowPlayingTitle = document.querySelector(".now-playing-title");
    nowPlayingTitle.innerHTML = `
        <div class="folder-name"><strong>${decodeURI(currFolder)}</strong></div>
        <div style="margin-top: 5px;"></div>
        <div class="song-name"><strong>${decodeURI(track)}</strong></div>
    `;

    // Update the icons only if playing
    if (!pause) {
        resetSongListToPlayNow();
        updatePlayPauseIcon(currentSongIndex);
    }
};

// Display all albums (folders)
async function displayAlbums() {
    let folders = await getAllFolders();
    let cardContainer = document.querySelector(".cardContainer");

    for (let folder of folders) {
        try {
            let a = await fetch(`/songs/${folder}/info.json`);
            let info = await a.json();

            albums.push({
                title: info.title,
                folder: folder
            });

            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="Album Cover">
                <h2>${info.title}</h2>
                <p>${info.description}</p>
            </div>`;
        } catch (e) {
            console.warn(`Could not load metadata for folder: ${folder}`);
        }
    }

    // Attach event listener to each card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let folder = item.currentTarget.dataset.folder;
            songs = await getSongs(folder);
            currentSongIndex = 0;
            playMusic(songs[0], true); // Load but not auto play
        });
    });
}

// Setup Search
function setupSearch() {
    searchInput.addEventListener('keypress', async function (event) {
        if (event.key === 'Enter') {
            let query = searchInput.value.trim().toLowerCase().replace(/\s+/g, ''); // Remove spaces from query
            console.log("User searched:", query);

            // Find the album that matches the query with spaces removed
            let matchedAlbum = albums.find(album => album.title.toLowerCase().replace(/\s+/g, '') === query);

            if (matchedAlbum) {
                console.log('Matched album:', matchedAlbum);
                songs = await getSongs(matchedAlbum.folder);
                currentSongIndex = 0;
                playMusic(songs[0], true); // Load but not autoplay
            } else {
                alert('No album found with that name!');
            }
        }
    });
}

// Main initializer
async function main() {
    await displayAlbums();
    setupSearch();

    // Default to first album
    let folders = await getAllFolders();
    if (folders.length > 0) {
        songs = await getSongs(folders[0]);
        currentSongIndex = 0;
        playMusic(songs[0], true); // load first song, but don't autoplay
    }

    // Play/pause control
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
            resetSongListToPlayNow();
            updatePlayPauseIcon(currentSongIndex);
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
            resetSongListToPlayNow();
        }
    });

    // Update seekbar and time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seek functionality
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Hamburger menu toggle
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous button
    previous.addEventListener("click", () => {
        currentSong.pause();
        previousSong();
    });

    // Next button
    next.addEventListener("click", () => {
        currentSong.pause();
        nextSong();
    });

    // Volume slider
    document.querySelector(".range input").addEventListener("input", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src =
                document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Mute/unmute toggle
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });

    // Autoplay next song when current ends
    currentSong.addEventListener("ended", () => {
        nextSong();
    });
};

// Next song
const nextSong = () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    playMusic(songs[currentSongIndex]);
};

// Previous song
const previousSong = () => {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    playMusic(songs[currentSongIndex]);
};

// Initialize everything
main();