import { NextRequest, NextResponse } from 'next/server';
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

// --- City Coordinates Mapping ---
const cityCoordinates: { [key: string]: { lat: number; lon: number; name: string } } = {
  'tsukuba': { lat: 36.0833, lon: 140.0833, name: 'TSUKUBA' },
  'tokyo': { lat: 35.6895, lon: 139.6917, name: 'TOKYO' },
  'osaka': { lat: 34.6937, lon: 135.5023, name: 'OSAKA' },
  'sapporo': { lat: 43.0618, lon: 141.3545, name: 'SAPPORO' },
  'fukuoka': { lat: 33.5904, lon: 130.4017, name: 'FUKUOKA' },
  'nagoya': { lat: 35.1815, lon: 136.9066, name: 'NAGOYA' },
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  
  // Get city from query parameters, default to Tsukuba
  const cityKey = request.nextUrl.searchParams.get('city')?.toLowerCase() || 'tsukuba';
  const city = cityCoordinates[cityKey] || cityCoordinates['tsukuba'];

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric&lang=ja`;

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

    // --- Data Processing ---
    const today = startOfToday();
    const todaysForecasts = data.list.filter((item: ForecastItem) => 
      isSameDay(new Date(item.dt * 1000), today)
    );
    const relevantForecasts = todaysForecasts.length > 0 ? todaysForecasts : data.list.slice(0, 8);
    const maxTemp = Math.max(...relevantForecasts.map((item: ForecastItem) => item.main.temp_max));
    const minTemp = Math.min(...relevantForecasts.map((item: ForecastItem) => item.main.temp_min));
    const currentWeather = data.list[0];

    const selectedHourlyForecasts = [];
    const seenTimestamps = new Set();
    if (data.list.length > 0) {
      selectedHourlyForecasts.push(data.list[0]);
      seenTimestamps.add(data.list[0].dt);
      let lastSelectedDt = data.list[0].dt;
      for (let i = 1; i < data.list.length && selectedHourlyForecasts.length < 5; i++) {
        const currentItem = data.list[i];
        if (currentItem.dt >= lastSelectedDt + (6 * 3600) && !seenTimestamps.has(currentItem.dt)) {
          selectedHourlyForecasts.push(currentItem);
          seenTimestamps.add(currentItem.dt);
          lastSelectedDt = currentItem.dt;
        }
      }
    }
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
      locationName: city.name,
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
