import Image from 'next/image';

// Define the list of selectable cities
const cities = [
  { key: 'tsukuba', name: 'TSUKUBA' },
  { key: 'tokyo', name: 'TOKYO' },
  { key: 'osaka', name: 'OSAKA' },
  { key: 'sapporo', name: 'SAPPORO' },
  { key: 'fukuoka', name: 'FUKUOKA' },
  { key: 'nagoya', name: 'NAGOYA' },
];

interface DailySummaryProps {
  locationName: string;
  currentWeatherIcon: string;
  maxTemp: number;
  minTemp: number;
  currentCity: string;
  setCity: (city: string) => void;
}

const DailySummary = ({ 
  locationName, 
  currentWeatherIcon, 
  maxTemp, 
  minTemp, 
  currentCity,
  setCity 
}: DailySummaryProps) => {
  return (
    <div className="themed-text flex flex-col items-center text-center p-4">
      <select 
        value={currentCity}
        onChange={(e) => setCity(e.target.value)}
        className="themed-text text-[var(--text-color)] mb-2 text-[clamp(2rem,6vw,5rem)] leading-tight bg-transparent appearance-none text-center focus:outline-none cursor-pointer"
      >
        {cities.map(city => (
          <option key={city.key} value={city.key} className="bg-[var(--bg-color)] text-[var(--text-color)]">
            {city.name}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-center space-x-4">
        <Image 
          src={`https://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`}
          alt="Current weather icon"
          width={100} // Intrinsic width
          height={100} // Intrinsic height
          className="themed-text h-auto w-[clamp(60px,15vw,120px)]"
          priority
        />
        <div className="text-[clamp(1.5rem,4vw,4rem)] leading-none">
          <div>H: {Math.round(maxTemp)}°</div>
          <div>L: {Math.round(minTemp)}°</div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;