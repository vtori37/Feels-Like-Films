// Javascript

var searchBtn = document.querySelector('#search-btn');
var cityInputEl = document.getElementById('city-input');
var currentEl = document.getElementById('current-container');
var forecastEl = document.getElementById('forecast-container');

var today = moment();
var dateNow = moment().format('l');   



var inputHandler = function (event) {
  event.preventDefault();

  let cityNameRaw = cityInputEl.value.trim();
  let cityName = cityNameRaw[0].toUpperCase() + cityNameRaw.slice(1);


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
       
      })
    })
}


var displayCurrent = function (current, cityName) {

  var city = document.createElement('h1');
  city.innerHTML = cityName  +  '('+dateNow+')' ;
  currentEl.appendChild(city);

  var iconDisplay = document.createElement('img');
  iconDisplay.setAttribute('src', `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`) ;
  currentEl.appendChild(iconDisplay);

  var temp = document.createElement('p');
  temp.innerHTML = "Temp:" + current.temp + "";
  currentEl.appendChild(temp);

  var wind = document.createElement('p');
  wind.innerHTML = "Wind:" + current.wind_speed;
  currentEl.appendChild(wind);

  var humidity = document.createElement('p');
  humidity.innerHTML = "Humidity:" + current.humidity;
  currentEl.appendChild(humidity);

 

  var uvi = document.createElement('p');
  uvi.innerHTML = 'UV Index' + current.uvi;
  if (current.uvi >= 11) {
    uvi.classList.add('purple');
  } else if (current.uvi >= 8 && current.uvi < 11) {
    uvi.classList.add('red');
  } else if (current.uvi >= 6 && current.uvi < 7) {
    uvi.classList.add('orange');
  }  else if (current.uvi >= 3 && current.uvi < 5) {
      uvi.classList.add('yellow');
    }   else if (current.uvi >= 0 && current.uvi < 2) {
      uvi.classList.add('green');
    }
  currentEl.appendChild(uvi);
   

}



searchBtn.addEventListener('click', inputHandler);
