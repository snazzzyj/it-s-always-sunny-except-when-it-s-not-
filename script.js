function getWeather(){
  const apiKey = 'd7478f711445dc059e50f3c1d108eeb9';
  const city = document.getElementById('city').value;

  if (!city) {
    alert('Please enter a city');
    return;
  }

   const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
        displayWeather(data);
    })
    .catch(error => {
        console.error('Error fetching current weather data', error);
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
        displayHourlyForecast(data.list);
        })
        .catch(error => {
          console.error('Error fetching hourly forecast data:', error);
          alert (`Error fetching hourly forecast data. Please try again.`);
        });
}

const weatherDescriptions = {
  "broken clouds": "Partly cloudy",
  "scattered clouds": "Mostly sunny",
  "clear sky": "Clear",
  "few clouds": "Mostly clear",
  "overcast clouds": "Cloudy"
};


function displayWeather(data) {

  const tempDivInfo = document.getElementById(`temp-div`);
  const weatherInfoDiv = document.getElementById('weather-info');
  const hourlyForecastDiv = document.getElementById('hourly-forecast');

  // Clear previous content
  weatherInfoDiv.innerHTML = '';
  hourlyForecastDiv.innerHTML = '';
  tempDivInfo.innerHTML = '';

  if (data.cod === '404') {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const apiDescription = data.weather[0].description;
    const description = weatherDescriptions[apiDescription];  
    const weatherHtml = `<p>Weather: ${description}</p>`;
    const weatherIcon = document.getElementById('weather-icon');

    const temperatureHTML = `
    <h1>${temperature}°C</h1>
    <h2>${cityName}</h2>
    <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
    document.getElementById('weather-container').classList.add('has-weather');

  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {

      const dateTime = new Date(item.dt * 1000);
      const hour = dateTime.getHours();
      const temperature = Math.round(item.main.temp - 273.15);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}°C</span>
      </div>
      `;
      hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.style.display = 'block';
}
