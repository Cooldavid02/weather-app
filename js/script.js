
// OpenWeather API configuration
const API_KEY = '3e093ed18d67d16bab589f07675f1df6'; // Replace with your actual API key
const CITIES = [
    { id: 5128581, name: 'New York', country: 'US' },
    { id: 2643743, name: 'London', country: 'GB' },
    { id: 1850147, name: 'Tokyo', country: 'JP' }
];

// DOM elements
const weatherContainer = document.getElementById('weatherContainer');
const refreshBtn = document.getElementById('refreshBtn');

// Function to fetch weather data
async function fetchWeatherData() {
    weatherContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading weather data...</div>';
    
    try {
        const weatherPromises = CITIES.map(city => 
            fetch(`https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${API_KEY}&units=metric`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Weather data not available');
                    }
                    return response.json();
                })
        );
        
        const weatherData = await Promise.all(weatherPromises);
        displayWeatherData(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherContainer.innerHTML = '<div class="loading">Failed to load weather data. Please try again later.</div>';
    }
}

// Function to display weather data
function displayWeatherData(data) {
    weatherContainer.innerHTML = '';
    
    data.forEach((cityData, index) => {
        const city = CITIES[index];
        const temp = Math.round(cityData.main.temp);
        const description = cityData.weather[0].description;
        const humidity = cityData.main.humidity;
        const windSpeed = cityData.wind.speed;
        const feelsLike = Math.round(cityData.main.feels_like);
        
        // Get appropriate weather icon
        const iconCode = cityData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2 class="city-name">
                <i class="fas fa-city"></i> ${city.name}, ${city.country}
            </h2>
            <div class="weather-icon">
                <img src="${iconUrl}" alt="${description}">
            </div>
            <div class="temperature">${temp}°C</div>
            <div class="weather-description">${description}</div>
            <div class="details">
                <div class="detail-item">
                    <span class="detail-label">Feels Like</span>
                    <span class="detail-value">${feelsLike}°C</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value">${windSpeed} m/s</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pressure</span>
                    <span class="detail-value">${cityData.main.pressure} hPa</span>
                </div>
            </div>
        `;
        
        weatherContainer.appendChild(card);
    });
}

// Event listener for refresh button
refreshBtn.addEventListener('click', fetchWeatherData);

// Initialize the app
fetchWeatherData();
