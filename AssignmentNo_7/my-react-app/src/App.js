import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const data = {
    nashik: {
      temp: 28,
      condition: "Sunny",
      humidity: 45,
      wind: 12,
      icon: "☀️"
    },
    mumbai: {
      temp: 31,
      condition: "Cloudy",
      humidity: 70,
      wind: 18,
      icon: "☁️"
    },
    pune: {
      temp: 26,
      condition: "Rainy",
      humidity: 80,
      wind: 10,
      icon: "🌧️"
    },
    delhi: {
      temp: 33,
      condition: "Sunny",
      humidity: 35,
      wind: 15,
      icon: "☀️"
    }
  };

  function searchWeather(e) {
    e.preventDefault();

    const name = city.trim().toLowerCase();

    if (data[name]) {
      setWeather({ ...data[name], city: city.trim() });
      setError("");
    } else {
      setWeather(null);
      setError("City not found! Try Nashik, Mumbai, Pune or Delhi.");
    }
  }

  return (
    <div className="app">
      <div className="weather-card">
        <h1>🌤️ Weather App</h1>
        <p className="subtitle">Check your city's weather</p>

        <form onSubmit={searchWeather}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.city}</h2>
            <div className="weather-icon">{weather.icon}</div>
            <h3>{weather.temp}°C</h3>
            <p>{weather.condition}</p>

            <div className="details">
              <div className="detail-box">
                <span>💧</span>
                <p>Humidity</p>
                <strong>{weather.humidity}%</strong>
              </div>

              <div className="detail-box">
                <span>💨</span>
                <p>Wind Speed</p>
                <strong>{weather.wind} km/h</strong>
              </div>
            </div>
          </div>
        )}

        {!weather && !error && (
          <p className="message">
            Search Nashik, Mumbai, Pune or Delhi
          </p>
        )}

        <p className="footer">Made with React JS ❤️</p>
      </div>
    </div>
  );
}

export default App;