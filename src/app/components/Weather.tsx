'use client';

import { useState, useEffect } from 'react';
import DailySummary from './DailySummary';
import HourlyForecast from './HourlyForecast';
import MoonPhase from './MoonPhase';

// Define the structure of the weather data
interface WeatherData {
  locationName: string;
  current: {
    temp: number;
    weather: {
      main: string;
      icon: string;
    };
  };
  daily: {
    temp: {
      max: number;
      min: number;
    };
  };
  hourly: {
    dt: number;
    weather: {
      icon: string;
    };
  }[];
}

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    // Refresh weather data every 30 minutes
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="themed-text text-2xl">Loading weather...</div>;
  }

  if (error) {
    return <div className="themed-text text-2xl text-red-500">Error: {error}</div>;
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <DailySummary 
        locationName={weatherData.locationName}
        currentWeatherIcon={weatherData.current.weather.icon}
        maxTemp={weatherData.daily.temp.max}
        minTemp={weatherData.daily.temp.min}
      />
      <MoonPhase date={new Date()} />
      <HourlyForecast hourlyData={weatherData.hourly} />
    </div>
  );
};

export default Weather;
