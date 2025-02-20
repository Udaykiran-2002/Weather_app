const apiKey = "f4e659302a0ca812364cc2c534b3a6d5";
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const refreshBtn = document.getElementById("refresh-btn");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherInfo = document.getElementById("weather-info");
const cityName = document.getElementById("city-name");
const currentWeather = document.getElementById("current-weather");
const forecast = document.getElementById("forecast");

// Load favorite city from localStorage
let favoriteCity = localStorage.getItem("favoriteCity");
if (favoriteCity) {
  cityInput.value = favoriteCity;
  fetchWeather(favoriteCity);
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

refreshBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  try {
    // Show loading and hide error/weather info
    showLoading();
    hideError();
    hideWeatherInfo();

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    // Check if responses are OK
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Display weather data and hide loading/error
    displayWeather(currentData, forecastData);
    hideError();
  } catch (err) {
    // Show error and hide weather info
    showError();
    hideWeatherInfo();
  } finally {
    // Always hide loading
    hideLoading();
  }
}

function displayWeather(currentData, forecastData) {
  cityName.textContent = currentData.name;
  currentWeather.innerHTML = `
    <p>🌡️ Temperature: ${currentData.main.temp}°C</p>
    <p>🌤️ Condition: ${currentData.weather[0].description}</p>
    <img class="weather-icon" src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="${currentData.weather[0].description}">
  `;

  forecast.innerHTML = "";
  for (let i = 0; i < forecastData.list.length; i += 8) {
    const day = forecastData.list[i];
    const date = new Date(day.dt * 1000).toLocaleDateString();
    forecast.innerHTML += `
      <div class="forecast-item">
        <span>📅 ${date}</span>
        <span>🌡️ ${day.main.temp}°C</span>
        <span>🌤️ ${day.weather[0].description}</span>
        <img class="weather-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
      </div>
    `;
  }

  // Show weather info
  showWeatherInfo();
}

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError() {
  error.classList.remove("hidden");
}

function hideError() {
  error.classList.add("hidden");
}

function showWeatherInfo() {
  weatherInfo.classList.remove("hidden");
}

function hideWeatherInfo() {
  weatherInfo.classList.add("hidden");
}
