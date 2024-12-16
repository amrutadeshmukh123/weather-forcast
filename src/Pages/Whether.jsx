import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Whether.css';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const apiKey = '12b4472d69a4dedee9ba383ade046952';

  
  const fetchWeather = async (cityName) => {
    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${'12b4472d69a4dedee9ba383ade046952'}`
      );
      setWeather(currentWeatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${'12b4472d69a4dedee9ba383ade046952'}`
      );
      const dailyForecast = forecastResponse.data.list.filter((item) =>
        item.dt_txt.includes('12:00:00')
      );
      setForecast(dailyForecast);
    } catch (error) {
      console.error("Error fetching data", error);
      setWeather(null);
      setForecast([]);
    }
  };

 
  const toggleFavorite = (cityName) => {
    let updatedFavorites;
    if (favorites.includes(cityName)) {
      updatedFavorites = favorites.filter((fav) => fav !== cityName);
    } else {
      updatedFavorites = [...favorites, cityName];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="weather-dashboard">
      <h2>Weather Forcasting Application</h2>
      <div className="search">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={() => fetchWeather(city)}>Search</button>
      </div>
      <div className="oneline">
        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <p>{weather.weather[0].description}</p>
            <p>Temperature: {weather.main.temp} °C</p>
            <button onClick={() => toggleFavorite(weather.name)}>
              {favorites.includes(weather.name) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        )}

        <div className="favorites">
          <h3>Favorite Cities</h3>
          {favorites.map((favCity) => (
            <button key={favCity} onClick={() => fetchWeather(favCity)}>
              {favCity}
            </button>
          ))}
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>5-Day Weather Forecast</h3>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(day.dt_txt).toDateString()}</p>
                <p>{day.weather[0].description}</p>
                <p>Temp: {day.main.temp} °C</p>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default WeatherDashboard;
