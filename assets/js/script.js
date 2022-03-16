// Javascript


// 

// 

// IMDB API Start
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
};

var imdbGetApi = function() {
    var apiUrl = "https://imdb-api.com/API/AdvancedSearch/" + imdbApiKey + "?title_type=feature&genres=" + imdbSelGenre + "&count=4";
    
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    imdbDispMovies(data.results[0]);
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
    var moviePoster = document.createElement("img");
    moviePoster.setAttribute("src", movieObj.image);
    moviePoster.setAttribute("width", "500");
    $("#movieDisplay").append(moviePoster);
    var movieTitle = document.createElement("p");
    movieTitle.textContent = movieObj.title;
    $("#movieDisplay").append(movieTitle);
    var movieDesc = document.createElement("p");
    movieDesc.textContent = movieObj.plot;
    $("#movieDisplay").append(movieDesc);
};

imdbGetApi();
// IMDB API End

// 