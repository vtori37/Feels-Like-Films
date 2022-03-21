// Javascript


// 

// 

// IMDB API Start ==============================================================================
// IMDB API Key
var imdbApiKey = "k_gto5fsb6";
// local storage movie lists
var watchlistLS = [];
// inits genre selection
var imdbSelGenre;
// list of available genres
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

var imdbTempList = [];

// function for selecting genre based on weather condition ID
var imdbGetGenre = function(weatherID) {
    switch (weatherID) {
        case '01d':
        case '01n':
            imdbSelGenre = imdbGenres[0];
            break;
        case '02d':
        case '02n':
            imdbSelGenre = imdbGenres[1];
            break;
        case '03d':
        case '03n':
            imdbSelGenre = imdbGenres[2];
            break;
        case '04d':
        case '04n':
            imdbSelGenre = imdbGenres[3];
            break;
        case '09d':
        case '09n':
            imdbSelGenre = imdbGenres[4];
            break;
        case '10d':
        case '10n':
            imdbSelGenre = imdbGenres[5];
            break;
        case '11d':
        case '11d':
            imdbSelGenre = imdbGenres[6];
            break;
        case '13d':
        case '13n':
            imdbSelGenre = imdbGenres[7];
            break;
        case '50d':
        case '50n':
            imdbSelGenre = imdbGenres[8];
            break;
        default:
            alert("Something broke!");
            imdbSelGenre = imdbGenres[0];
            break;
    }

    // runs the call for movie
    imdbGetMovie();
};

// function that calls the IMDB api
var imdbGetMovie = function() {
    var apiUrl = "https://imdb-api.com/API/AdvancedSearch/" + imdbApiKey + "?title_type=feature&genres=" + imdbSelGenre + "&count=4";
    
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    imdbTempList = data.results;
                    if (!data.results || data.results.length === 0) {
                        $("#movie-recommendation").html("Could not find movies! Maximum searches reached for today.");
                        return false;
                    }
                    // loops through all results to generate html content
                    for (var i = 0; i < data.results.length; i++) {
                        imdbDispMovies(data.results[i], i);
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

// generates movie recommendation html for each result
var imdbDispMovies = function(movieObj, i) {
    // create movie li element
    var movieLiEl = document.createElement("li");
    
    // add to watchlist button
    var btnAddWatchEl = document.createElement("button");
    btnAddWatchEl.id = "add-to-watchlist";
    btnAddWatchEl.setAttribute("movID", i);
    btnAddWatchEl.textContent = "Add to Watchlist";
    movieLiEl.appendChild(btnAddWatchEl);

    // movie poster
    var moviePosterEl = document.createElement("img");
    moviePosterEl.className = "movie-poster";
    moviePosterEl.setAttribute("src", movieObj.image);
    // I set an arbitary width to size the movie poster, can adjust as needed
    moviePosterEl.setAttribute("width", "250");
    movieLiEl.appendChild(moviePosterEl);

    // div box that holds text
    var descBoxEl = document.createElement("div");
    descBoxEl.className = "description-box";
    movieLiEl.appendChild(descBoxEl);

    // movie title
    var movieTitleEl = document.createElement("h3");
    movieTitleEl.className = "movie-title";
    movieTitleEl.textContent = movieObj.title;
    descBoxEl.appendChild(movieTitleEl);

    // movie genre and weather icon
    var movieGenreWeatherIconEl = document.createElement("h4");
    movieGenreWeatherIconEl.className = "movie-genre weather-icon";
    movieGenreWeatherIconEl.textContent = movieObj.genres + " (Weather Icon Placeholder)";
    descBoxEl.appendChild(movieGenreWeatherIconEl);

    // movie description/plot
    var movieDescEl = document.createElement("p");
    movieDescEl.className = "movie-description";
    movieDescEl.textContent = movieObj.plot;
    descBoxEl.appendChild(movieDescEl);
    
    // appends to the movie recommendation ul in index.html
    $("#movie-recommendation").append(movieLiEl);
};

var imdbDispWatchlist = function(movieObj, i) {
    // create movie li element
    var movieLiEl = document.createElement("li");
    
    // remove from watchlist button
    var btnAddWatchEl = document.createElement("button");
    btnAddWatchEl.id = "remove";
    btnAddWatchEl.setAttribute("movID", i);
    btnAddWatchEl.textContent = "Remove";
    movieLiEl.appendChild(btnAddWatchEl);

    // movie poster
    var moviePosterEl = document.createElement("img");
    moviePosterEl.className = "movie-poster";
    moviePosterEl.setAttribute("src", movieObj.image);
    // I set an arbitary width to size the movie poster, can adjust as needed
    moviePosterEl.setAttribute("width", "250");
    movieLiEl.appendChild(moviePosterEl);

    // div box that holds text
    var descBoxEl = document.createElement("div");
    descBoxEl.className = "description-box";
    movieLiEl.appendChild(descBoxEl);

    // movie title
    var movieTitleEl = document.createElement("h3");
    movieTitleEl.className = "movie-title";
    movieTitleEl.textContent = movieObj.title;
    descBoxEl.appendChild(movieTitleEl);

    // movie genre and weather icon
    var movieGenreWeatherIconEl = document.createElement("h4");
    movieGenreWeatherIconEl.className = "movie-genre weather-icon";
    movieGenreWeatherIconEl.textContent = movieObj.genres + " (Weather Icon Placeholder)";
    descBoxEl.appendChild(movieGenreWeatherIconEl);

    // movie description/plot
    var movieDescEl = document.createElement("p");
    movieDescEl.className = "movie-description";
    movieDescEl.textContent = movieObj.plot;
    descBoxEl.appendChild(movieDescEl);
    
    // appends to the movie recommendation ul in index.html
    $("#watch-list-titles").append(movieLiEl);
};

var imdbSaveWatchlist = function() {
    localStorage.setItem("watchlist", JSON.stringify(watchlistLS));
};

var imdbLoadWatchlist = function() {
    watchlistLS = JSON.parse(localStorage.getItem("watchlist"));
    $("#watch-list-titles").html("");

    if (!watchlistLS || watchlistLS.length === 0) {
        $("#watch-list-titles").html("No Movies!");
        watchlistLS = [];
        return false;
    }

    for (var i = 0; i < watchlistLS.length; i++) {
        imdbDispWatchlist(watchlistLS[i], i);
    }
};

$("#movie-recommendation").on("click", "#add-to-watchlist", function() {
    var movieID = $(this).attr("movID");
    for (var i = 0; i < watchlistLS.length; i++) {
        if (watchlistLS[i].id === imdbTempList[movieID].id) {
            return false;
        }
    }
    watchlistLS.push(imdbTempList[movieID]);
    
    if (watchlistLS.length > 5) {
        watchlistLS.shift();
    }

    // save to local storage
    imdbSaveWatchlist();

    // Refresh Watch List
    imdbLoadWatchlist();
});

$("#watch-list-titles").on("click", "#remove", function() {
    var movieID = $(this).attr("movID");
    watchlistLS.splice(movieID, 1);

    imdbSaveWatchlist();

    imdbLoadWatchlist();
})

// hardcoded weather condition for now
imdbGetGenre("01d");
imdbLoadWatchlist();
// IMDB API End ======================================================================

// 