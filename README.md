# Groove Music Player

## Description
<!-- Description of the project -->
Groove Music Player is a simple yet powerful music player built using HTML, CSS, and JavaScript. It allows users to browse through albums, search for songs, and enjoy a seamless audio experience. With features like play/pause, volume control, a responsive dark-themed interface, and dynamic album loading, this app makes music listening easy and enjoyable across devices.

## Project Structure
<!-- Folder structure of the project -->
/songs/ # All albums stored here
/album-name/
- cover.jpg # Album cover image
- info.json # Album metadata (title, description)
- track1.mp3 # Song track 1
- track2.mp3 # Song track 2
/css/

utility.css # Utility-first CSS (inspired by Tailwind)
/js/

script.js # Main JavaScript functionality
/img/

play.svg # Play button icon

pause.svg # Pause button icon

music.svg # Music icon

volume.svg # Volume button icon

mute.svg # Mute button icon
index.html # Main HTML file
README.md # Project documentation

## Features
<!-- List of features -->
- **Dynamic Album Loading** — Albums are automatically fetched from the `/songs/` directory.
- **Search for Albums** — Quickly search for and play albums by name.
- **Playback Controls** — Play, pause, and skip to next/previous tracks.
- **Seekbar** — Navigate through songs by clicking on the seekbar.
- **Volume Control** — Adjust or mute the volume.
- **Responsive Design** — Mobile-friendly with smooth transitions.
- **Dark Mode** — A sleek black and grey theme.
- **Custom Scrollbar** — Styled scrollbar to match the theme.

## How to Use
<!-- Steps to use the music player -->
1. **Clone or Download** this repository to your local machine.

2. **Add Music**:
   - Place your albums in the `/songs/` folder. Each album should have:
     - `cover.jpg` (album cover image)
     - `info.json` (album metadata)
     - MP3 files for each track

   Example of `info.json`:

   ```json
   {
     "title": "Album Title",
     "description": "A short description of the album."
   }
## Run the App:

Open the index.html file in your browser, or use a local server like VSCode's Live Server or Python's built-in HTTP server.

Example using Python's HTTP server:
python3 -m http.server
Access the App:

Open your browser and navigate to: http://localhost:8000

## Built With
<!-- Technologies used in the project -->
HTML5

CSS3 (Custom utility-first CSS)

JavaScript (ES6+)

No external libraries or frameworks!

## Screenshots
<!-- Visual preview of the project -->
Logos
Cover pages
svgs

## Features & Future Improvements
<!-- Planned or upcoming features -->
Shuffle and Repeat modes (coming soon)

Playlist Queue for continuous playback

Theme Toggle (light/dark mode switch)

Offline Playback (via PWA support)

## Links
<!-- Project demo or GitHub link -->
GitHub Repository: https://github.com/sandeepnama210/groove-music-player

## Questions & Issues
<!-- How users can contribute or raise issues -->
Feel free to create an issue or submit a pull request if you encounter any bugs or have suggestions!

## Built by
<!-- Credits to the developer -->
👨‍💻 Nama Sandeep Kumar
Made with ❤️ for easy listening.
