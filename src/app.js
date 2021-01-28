// Current date
function formatTime(time) {
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[time.getDay()];
  let date = time.getDate();
  let hour = time.getHours();
  if (hour <10) {
    hour = `0${hour}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let fullDate = `${day} ${date}, ${hour}:${minutes}h`
  return fullDate;
}
let currentDate = new Date();
let currentTime = document.querySelector("#current-time");
currentTime.innerHTML = formatTime(currentDate);

// Search engine and forecast
function showTemperature(response) {
  document.querySelector("#current-city").innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  celsiusTemp = Math.round(response.data.main.temp);
  document.querySelector("#current-temperature").innerHTML = `${celsiusTemp}ºC`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(response.data.wind.speed)}km/h`;
  document.querySelector("#weather-description").innerHTML = response.data.weather[0].description;
  let icon = response.data.weather[0].icon;
  let iconElement = document.querySelector("#current-icon")
  iconElement.setAttribute("src", `src/icons/icon_${icon}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
        // Forecast
function formatDays(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour <10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hour}:${minutes}h`;
}
function displayForecast(response) {
  document.querySelector("#forecast-two").innerHTML = null;
  document.querySelector("#forecast-three").innerHTML = null;
  let forecast = null;
  let timezone = response.data.city.timezone;
  for (let index = 0; index < 2; index++) {
    forecast = response.data.list[index];
    document.querySelector("#forecast-two").innerHTML += `
    <div class="col forecast-squares">
      <div class="row">
        <div class="col-6">
          <p>${formatDays((forecast.dt + timezone) * 1000)}</p>
          <p><strong><span class="max-temp">${Math.round(forecast.main.temp_max)}</span>º</strong> | <span class="min-temp">${Math.round(forecast.main.temp_min)}</span>º</p>
        </div>
        <div class="col-6">
          <img src="src/icons/icon_${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}" class="w-100">
        </div>
      </div>
    </div>`
  }
  for (let index = 2; index < 5; index++) {
    forecast = response.data.list[index];
    document.querySelector("#forecast-three").innerHTML += `
    <div class="col forecast-squares">
      <p>${formatDays((forecast.dt + timezone) * 1000)}</p>
      <img src="src/icons/icon_${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}" class="w-50">
    </div>`
  }
}
function search(city) {
  let apiKey = `b89a2bda363f782379e90e985a8aa5e3`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
  let apiUrlMetric = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  let apiUrlImperial = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  if ((document.querySelector("#units-conversion")).innerHTML === "F") {
    axios.get(apiUrlMetric).then(displayForecast);  
  } else {
    axios.get(apiUrlImperial).then(displayForecast);
  } 
}
function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  document.querySelector("#units-conversion").innerHTML = "F";
  search(city);  
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);
search("Moralzarzal");

// Current button
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = `b89a2bda363f782379e90e985a8aa5e3`
  let geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  document.querySelector("#units-conversion").innerHTML = "F";
  axios.get(geoApiUrl).then(showTemperature);
  geoApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(geoApiUrl).then(displayForecast);
}
function showCurrentTemp(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let currentPlaceBtn = document.querySelector("#current-place-btn");
currentPlaceBtn.addEventListener("click", showCurrentTemp);

// Units conversion
function changeUnits(event) {
  event.preventDefault();
  let unitsConversion = document.querySelector("#units-conversion");
  if (unitsConversion.innerHTML === "F") {
    let tempElement = document.querySelector("#current-temperature");
    let fahrenheitTemp = Math.round((celsiusTemp * 9) / 5 + 32);
    tempElement.innerHTML = `${fahrenheitTemp}ºF`;
    unitsConversion.innerHTML = "C";
    
    let forecastMax = document.querySelectorAll(".max-temp");
    forecastMax.forEach(function (item) {
      // grabbing the current value to convert
      let currentTemp = item.innerHTML;
      // convert to Fahrenheit
      item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
    let forecastMin = document.querySelectorAll(".min-temp");
    forecastMin.forEach(function (item) {
      // grabbing the current value to convert
      let currentTemp = item.innerHTML;
      // convert to Fahrenheit
      item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
  } else {
    let tempElement = document.querySelector("#current-temperature");
    tempElement.innerHTML = `${celsiusTemp}ºC`;
    unitsConversion.innerHTML = "F";
    
    let forecastMax = document.querySelectorAll(".max-temp");
    forecastMax.forEach(function (item) {
      // grabbing the current value to convert
      let currentTemp = item.innerHTML;
      // convert to Celsius
      item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
    let forecastMin = document.querySelectorAll(".min-temp");
    forecastMin.forEach(function (item) {
      // grabbing the current value to convert
      let currentTemp = item.innerHTML;
      // convert to Celsius
      item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
  }
}
let conversionButton = document.querySelector("#units-btn");
conversionButton.addEventListener("click", changeUnits);
let celsiusTemp = null;