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

// Search engine
function showTemperature(response) {
  console.log(response);
  document.querySelector("#current-city").innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#current-temperature").innerHTML = `${Math.round(response.data.main.temp)}ºC`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(response.data.wind.speed)}km/h`;
  document.querySelector("#weather-description").innerHTML = response.data.weather[0].description;
  // falta darle una vuelta a esta parte, consiguiendo cambiar los iconos por los de openweathermap...
  let icon = response.data.weather[0].icon;
  document.querySelector("#current-icon").setAttribute("src", `src/icons/icon_${icon}.png`);
}
function search(city) {
  let apiKey = `b89a2bda363f782379e90e985a8aa5e3`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  search(city);  
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);
search("Moralzarzal");

// Icon library
