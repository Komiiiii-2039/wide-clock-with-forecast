import { NextResponse } from 'next/server';
import { startOfToday, isSameDay } from 'date-fns';

// Define types for OpenWeatherMap API response
interface WeatherInfo {
  main: string;
  icon: string;
}

interface MainWeatherData {
  temp: number;
  temp_max: number;
  temp_min: number;
}

interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherInfo[];
}

interface OpenWeatherMapResponse {
  list: ForecastItem[];
}

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const lat = 36.0833; // Tsukuba latitude
  const lon = 140.0833; // Tsukuba longitude
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return NextResponse.json(
      { error: 'OpenWeatherMap API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenWeatherMap API Error:', errorData);
      return NextResponse.json(
        { error: `Failed to fetch weather data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data: OpenWeatherMapResponse = await response.json();

    // --- Data Processing for v2.5/forecast ---

    // Get today's date for filtering
    const today = startOfToday();

    // Filter for today's forecast entries
    const todaysForecasts = data.list.filter((item: ForecastItem) => 
      isSameDay(new Date(item.dt * 1000), today)
    );

    // If no forecasts for today, use the first available
    const relevantForecasts = todaysForecasts.length > 0 ? todaysForecasts : data.list.slice(0, 8);

    // Calculate daily min/max from today's entries
    const maxTemp = Math.max(...relevantForecasts.map((item: ForecastItem) => item.main.temp_max));
    const minTemp = Math.min(...relevantForecasts.map((item: ForecastItem) => item.main.temp_min));

    // Get current weather from the first item in the list
    const currentWeather = data.list[0];

    // Process hourly forecasts to get 5 entries roughly 6 hours apart
    const selectedHourlyForecasts = [];
    const seenTimestamps = new Set(); // To ensure unique timestamps

    // Start from the first forecast available
    if (data.list.length > 0) {
      selectedHourlyForecasts.push(data.list[0]);
      seenTimestamps.add(data.list[0].dt);
      let lastSelectedDt = data.list[0].dt;

      for (let i = 1; i < data.list.length && selectedHourlyForecasts.length < 5; i++) {
        const currentItem = data.list[i];
        // Check if the current item's timestamp is roughly 6 hours after the last selected item
        // And if it hasn't been added already
        if (
          currentItem.dt >= lastSelectedDt + (6 * 3600) &&
          !seenTimestamps.has(currentItem.dt)
        ) {
          selectedHourlyForecasts.push(currentItem);
          seenTimestamps.add(currentItem.dt);
          lastSelectedDt = currentItem.dt;
        }
      }
    }

    // If we still don't have 5, just take the next available unique ones
    let i = 0;
    while (selectedHourlyForecasts.length < 5 && i < data.list.length) {
        const item = data.list[i];
        if (!seenTimestamps.has(item.dt)) {
            selectedHourlyForecasts.push(item);
            seenTimestamps.add(item.dt);
        }
        i++;
    }

    const processedData = {
      locationName: 'TSUKUBA',
      current: {
        temp: currentWeather.main.temp,
        weather: {
          main: currentWeather.weather[0].main,
          icon: currentWeather.weather[0].icon,
        },
      },
      daily: {
        temp: {
          max: maxTemp,
          min: minTemp,
        },
      },
      hourly: selectedHourlyForecasts.slice(0, 5).map((h: ForecastItem) => ({
        dt: h.dt,
        weather: {
          icon: h.weather[0].icon,
        },
      })),
    };

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}