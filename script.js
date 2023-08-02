// Get references to the HTML elements for the playlist form and display
const playlistForm = document.getElementById("playlist-form");
const playlistNameInput = document.getElementById("playlist-name");
const publicPlaylistCheckbox = document.getElementById("public-playlist");
const playlistList = document.getElementById("playlist-list");

// Array to store playlists (You can use local storage for persistence, but we'll keep it simple for this example)
const playlists = [];

// Array to store movie search results
let movieData = [];

// Function to create a playlist
function createPlaylist(event) {
  event.preventDefault();
  const playlistName = playlistNameInput.value.trim();
  const isPublic = publicPlaylistCheckbox.checked;

  if (playlistName === "") {
    alert("Please enter a name for the playlist.");
    return;
  }

  // Create a new playlist object
  const newPlaylist = {
    name: playlistName,
    public: isPublic,
    movies: [], // Store movie data here for the playlist
  };

  // Add the playlist to the playlists array
  playlists.push(newPlaylist);

  // Clear the form inputs
  playlistNameInput.value = "";
  publicPlaylistCheckbox.checked = false;

  // Display the updated playlists
  displayPlaylists();
}

// Function to display playlists
function displayPlaylists() {
  playlistList.innerHTML = ""; // Clear previous playlists

  playlists.forEach((playlist, index) => {
    const playlistItem = document.createElement("li");
    playlistItem.textContent = `${playlist.name} (${playlist.public ? "Public" : "Private"})`;

    // Create a button to add movies to this playlist
    const addButton = document.createElement("button");
    addButton.textContent = "Add Movies";
    addButton.addEventListener("click", () => openMovieSelectionDialog(index));

    playlistItem.appendChild(addButton);
    playlistList.appendChild(playlistItem);
  });
}

// Function to open the movie selection dialog from search results
function openMovieSelectionDialogFromResults(movie) {
    const playlistNames = playlists.map((playlist) => playlist.name);
    const selectedPlaylistName = prompt(
      `Enter the playlist name to add "${movie.Title}" to (${playlistNames.join(", ")}):`
    );
  
    if (!selectedPlaylistName) {
      return;
    }
  
    const selectedPlaylist = playlists.find((playlist) => playlist.name === selectedPlaylistName);
  
    if (!selectedPlaylist) {
      alert("Invalid playlist name. Please enter a valid playlist name.");
      return;
    }
  
    // Add the movie to the selected playlist
    selectedPlaylist.movies.push(movie);
  
    // Display the updated playlists
    displayPlaylists();
  
    // Display success message
    alert(`Successfully added "${movie.Title}" to the playlist "${selectedPlaylist.name}"`);
  }
  

// Function to display playlists and their movies
function displayPlaylists() {
  playlistList.innerHTML = ""; // Clear previous playlists

  playlists.forEach((playlist, index) => {
    const playlistItem = document.createElement("li");

    // Create a clickable playlist name to display the movies added
    const playlistNameLink = document.createElement("a");
    playlistNameLink.textContent = `${playlist.name} (${playlist.public ? "Public" : "Private"})`;
    playlistNameLink.href = "#"; // For the sake of demonstration, we'll use "#" as the link, but you can implement the actual functionality here
    playlistNameLink.addEventListener("click", () => displayMoviesInPlaylist(index));

    playlistItem.appendChild(playlistNameLink);
    playlistList.appendChild(playlistItem);
  });
}

// Function to display movies in a specific playlist
function displayMoviesInPlaylist(playlistIndex) {
  const selectedPlaylist = playlists[playlistIndex];

  if (selectedPlaylist.movies.length === 0) {
    alert("No movies added to this playlist yet.");
    return;
  }

  let movieList = "Movies added to this playlist:\n";

  selectedPlaylist.movies.forEach((movie, index) => {
    movieList += `${index + 1}. ${movie.Title} (${movie.Year})\n`;
  });

  alert(movieList);
}

// Event listener for the playlist form submission
playlistForm.addEventListener("submit", createPlaylist);

// Get references to the HTML elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsSection = document.getElementById("results-section");

// OMDB API URL and API key (replace 'YOUR_API_KEY' with your actual API key from https://www.omdbapi.com/)
const apiUrl = "https://www.omdbapi.com/";
const apiKey = "f38ecd32";

// Function to fetch movie data from the OMDB API
async function searchMovies() {
  const query = searchInput.value.trim();
  if (query === "") {
    alert("Please enter a movie title to search.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}?apikey=${apiKey}&s=${query}`);
    const data = await response.json();

    if (data.Response === "True") {
      // Store movie search results
      movieData = data.Search;
      // Display search results
      displayMovies(movieData);
    } else {
      alert("No movies found. Please try a different search term.");
    }
  } catch (error) {
    alert("An error occurred while fetching movie data. Please try again later.");
  }
}

// Function to display movie search results
function displayMovies(movies) {
    resultsSection.innerHTML = ""; // Clear previous results
  
    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
  
      const title = document.createElement("h2");
      title.textContent = movie.Title;
  
      const year = document.createElement("p");
      year.textContent = `Year: ${movie.Year}`;
  
      const poster = document.createElement("img");
      poster.src = movie.Poster;
      poster.alt = movie.Title;
  
      const addButton = document.createElement("button");
      addButton.textContent = "Add to Playlist";
      addButton.addEventListener("click", () => openMovieSelectionDialogFromResults(movie));
  
      movieCard.appendChild(title);
      movieCard.appendChild(year);
      movieCard.appendChild(poster);
      movieCard.appendChild(addButton);
  
      resultsSection.appendChild(movieCard);
    });
}
  

// Event listener for the search button
searchButton.addEventListener("click", searchMovies);

//testing