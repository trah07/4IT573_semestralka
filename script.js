async function readTextFile(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text.trim();
}

readTextFile('api_key.txt')
  .then((apiKey) => {
    const apiKeyConst = apiKey;
    fetchMoviesNowPlaying(apiKeyConst);
  })
  .catch((error) => {
    console.error('Error reading file:', error);
  });

const apiBaseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w300';

const moviesGrid = document.getElementById('movies-grid');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const categoryTitle = document.getElementById('category-title');

async function fetchMoviesNowPlaying(apiKey) {
  const response = await fetch(
    `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`
  );
  const jsonResponse = await response.json();
  const movies = jsonResponse.results;
  displayMovies(movies);
}

async function searchMovies(query) {
  const response = await fetch(
    `${apiBaseUrl}/search/movie?api_key=${apiKey}&query="${query}"`
  );
  const jsonResponse = await response.json();
  const movies = jsonResponse.results;

  displayMovies(movies);
}

function displayMovies(movies) {
  moviesGrid.innerHTML = movies
    .map(
      (movie) =>
        `<div class="movie-card">
	            <img src="${imageBaseUrl}${movie.poster_path}"/>
	            <p>⭐${movie.vote_average}</p>
	            <h1>${movie.title}</h1>
	        </div>`
    )
    .join('');
}

function handleSearchFormSubmit(event) {
  categoryTitle.innerHTML = 'Search Results';
  event.preventDefault();
  const searchQuery = searchInput.value;
  const movies = searchMovies(searchQuery);
  displayMovies(movies);
}

async function getImdbId(movieId) {
  const response = await fetch(
    `${apiBaseUrl}/movie/${movieId}/external_ids?api_key=${apiKey}`
  );
  const jsonResponse = await response.json();
  console.log(jsonResponse);
}

searchForm.addEventListener('submit', handleSearchFormSubmit);
fetchMoviesNowPlaying();
