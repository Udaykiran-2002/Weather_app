// Script file
const apiKey = '599a63ab35897403038317ad37243ba1';

function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            getForecast(city);
            displayMap(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '<h3>5-Day Forecast:</h3>';
    data.list.forEach((item, index) => {
        if (index % 8 === 0) {
            const date = new Date(item.dt * 1000);
            forecast.innerHTML += `
                <div class="forecast-item">
                    <p><strong>${date.toDateString()}</strong></p>
                    <p>Temp: ${item.main.temp}°C</p>
                    <p>Weather: ${item.weather[0].description}</p>
                </div>
            `;
        }
    });
}

function displayMap(lat, lon) {
    const map = document.getElementById('map');
    map.innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed"></iframe>`;
}
