// Javascript


// 

// 

// IMDB API Start
// IMDB API Key
var imdbApiKey = "k_gto5fsb6";
var imdbSelGenre;
var imdbGenres = [
    "action",
    "comedy",
    "crime",
    "drama",
    "horror",
    "mystery",
    "romance",
    "sci_fi",
    "thriller"
];

var imdbGetGenre = function(weatherID) {
    switch (weatherID) {
        case '01d':
            imdbSelGenre = imdbGenres[0];
            break;
        case '02d':
            imdbSelGenre = imdbGenres[1];
            break;
        case '03d':
            imdbSelGenre = imdbGenres[2];
            break;
        case '04d':
            imdbSelGenre = imdbGenres[3];
            break;
        case '09d':
            imdbSelGenre = imdbGenres[4];
            break;
        case '10d':
            imdbSelGenre = imdbGenres[5];
            break;
        case '11d':
            imdbSelGenre = imdbGenres[6];
            break;
        case '13d':
            imdbSelGenre = imdbGenres[7];
            break;
        case '50d':
            imdbSelGenre = imdbGenres[8];
            break;
    }

    imdbGetMovie();
};

var imdbGetMovie = function() {
    var apiUrl = "https://imdb-api.com/API/AdvancedSearch/" + imdbApiKey + "?title_type=feature&genres=" + imdbSelGenre + "&count=4";
    
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    for (var i = 0; i < data.results.length; i++) {
                        imdbDispMovies(data.results[i]);
                    }
                });
            }
            else {
                alert("Error: Movies not found");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to IMDB");
        });
};

var imdbDispMovies = function(movieObj) {
    var movieLiEl = document.createElement("li");
    var btnAddWatchEl = document.createElement("button");
    btnAddWatchEl.textContent = "Add to Watchlist";
    movieLiEl.appendChild(btnAddWatchEl);

    var moviePosterEl = document.createElement("img");
    moviePosterEl.className = "movie-poster";
    moviePosterEl.setAttribute("src", movieObj.image);
    moviePosterEl.setAttribute("width", "250");
    movieLiEl.appendChild(moviePosterEl);

    var descBoxEl = document.createElement("div");
    descBoxEl.className = "description-box";
    movieLiEl.appendChild(descBoxEl);

    var movieTitleEl = document.createElement("h2");
    movieTitleEl.className = "movie-title";
    movieTitleEl.textContent = movieObj.title;
    descBoxEl.appendChild(movieTitleEl);

    var movieGenreWeatherIconEl = document.createElement("h3");
    movieGenreWeatherIconEl.className = "movie-genre weather-icon";
    movieGenreWeatherIconEl.textContent = movieObj.genres + " (Weather Icon Placeholder)";
    descBoxEl.appendChild(movieGenreWeatherIconEl);

    var movieDescEl = document.createElement("p");
    movieDescEl.className = "movie-description";
    movieDescEl.textContent = movieObj.plot;
    descBoxEl.appendChild(movieDescEl);
    
    $("#movie-recommendation").append(movieLiEl);
};

imdbGetGenre("01d");
// IMDB API End

// 