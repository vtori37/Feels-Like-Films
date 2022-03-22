
// Javascript

var searchBtn = document.querySelector('#search-btn');
var weatherCityInputEl = document.getElementById('city-input');
var weatherCurrentEl = document.getElementById('current-container');
var weatherForecastEl = document.getElementById('forecast-container');

var today = moment();
var dateNow = moment().format('l');   



var inputHandler = function (event) {
  event.preventDefault();

  let cityNameRaw = weatherCityInputEl.value.trim();
  let cityName = cityNameRaw[0].toUpperCase() + cityNameRaw.slice(1);
  weatherCityInputEl.value = " ";

  while (weatherCurrentEl.firstChild) {
    weatherCurrentEl.removeChild(weatherCurrentEl.firstChild);
  }

  getApi(cityName);

}

// Get city name. When input and submit button...
function getApi(cityName) {

  console.log(cityName);

  var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=42315a92a191c90b4007c062b41a8de1';

  fetch(requestUrl)
    .then(function (response) {
      //console.log(response);
      response.json().then(function (data) {

        console.log(data);

        var lat = data.coord.lat;
        var lon = data.coord.lon;
        oneCallApi(lat, lon, cityName);

      })
    })
}

function oneCallApi(lat, lon, cityName) {

  var requestOneCallApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=42315a92a191c90b4007c062b41a8de1'

  fetch(requestOneCallApi)
    .then(function (response) {
      //console.log(response);
      response.json().then(function (data) {

        console.log(data);

        displayCurrent(data.current, cityName);
        imdbGetGenre(data.current.weather[0].icon);
       
      })
    })
}


// display current weather
var displayCurrent = function (current, cityName) {

  var currentWrapper = document.createElement('div');
  weatherCurrentEl.appendChild(currentWrapper);
  currentWrapper.classList.add('currentWrapper');

  var nameIcon = document.createElement('div');
  currentWrapper.appendChild(nameIcon);
  nameIcon.classList.add('row', 'nameIcon');
  nameIcon.setAttribute("style", "margin: 0");

  var city = document.createElement('h2');
  city.innerHTML = cityName + '(' + dateNow + ')';
  nameIcon.appendChild(city);

  var iconDisplay = document.createElement('img');
  iconDisplay.setAttribute('src', `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);
  nameIcon.appendChild(iconDisplay);

  var temp = document.createElement('p');
  temp.innerHTML = "Temp:" + " " + current.temp + "℉";
  currentWrapper.appendChild(temp);

  var wind = document.createElement('p');
  wind.innerHTML = "Wind:" + " " + current.wind_speed + "MPH";
  currentWrapper.appendChild(wind);

  var humidity = document.createElement('p');
  humidity.innerHTML = "Humidity:" + " " + current.humidity + "%";
  currentWrapper.appendChild(humidity);

  var uvDiv = document.createElement('div');
  currentWrapper.appendChild(uvDiv);
  uvDiv.classList.add('row');
  uvDiv.setAttribute("style", "margin: 0");

  var uvText = document.createElement('p');
  uvText.innerHTML = 'UV Index:'+ " " ;
  uvDiv.appendChild(uvText);


  var uvi = document.createElement('p');
  uvi.innerHTML = current.uvi;
  if (current.uvi >= 11) {
    uvi.classList.add('purple');
  } else if (current.uvi >= 8 && current.uvi < 11) {
    uvi.classList.add('red');
  } else if (current.uvi >= 6 && current.uvi < 7) {
    uvi.classList.add('orange');
  } else if (current.uvi >= 3 && current.uvi < 5) {
    uvi.classList.add('yellow');
  } else if (current.uvi >= 0 && current.uvi < 2) {
    uvi.classList.add('green');
  }
  uvi.classList.add('uvi');
  uvDiv.classList.add('uvDiv');

  uvDiv.appendChild(uvi);
   

}



searchBtn.addEventListener('click', inputHandler);

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
                    // clears movie recommendation
                    $("#movie-recommendation").html("");
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
    btnAddWatchEl.className = "button waves-effect waves-light btn";
    btnAddWatchEl.setAttribute("movID", i);
    btnAddWatchEl.textContent = "Add to Watchlist";
    movieLiEl.appendChild(btnAddWatchEl);

    // movie poster
    var moviePosterEl = document.createElement("img");
    moviePosterEl.className = "movie-poster";
    moviePosterEl.setAttribute("src", movieObj.image);
    // I set an arbitary width to size the movie poster, can adjust as needed
    moviePosterEl.setAttribute("width", "150");
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
    btnAddWatchEl.className = "button waves-effect waves-light btn";
    btnAddWatchEl.setAttribute("movID", i);
    btnAddWatchEl.textContent = "Remove";
    movieLiEl.appendChild(btnAddWatchEl);

    // movie poster
    var moviePosterEl = document.createElement("img");
    moviePosterEl.className = "movie-poster";
    moviePosterEl.setAttribute("src", movieObj.image);
    // I set an arbitary width to size the movie poster, can adjust as needed
    moviePosterEl.setAttribute("width", "150");
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
    movieDescEl.className = "movie-description rounded";
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

// adds movie to watchlist, last movie added goes to the bottom of the list
// up to 5 movies can be saved, when a 6th movie is added, the oldest movie
// positioned at the top of the list is removed
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

// loads the watch list from localStorage
imdbLoadWatchlist();
// IMDB API End ======================================================================

// 

