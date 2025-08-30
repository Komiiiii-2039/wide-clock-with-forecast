
import Image from 'next/image';

interface DailySummaryProps {
  locationName: string;
  currentWeatherIcon: string;
  maxTemp: number;
  minTemp: number;
}

const DailySummary = ({ locationName, currentWeatherIcon, maxTemp, minTemp }: DailySummaryProps) => {
  return (
    <div className="themed-text flex flex-col items-center text-center p-4">
      <h2 className="mb-2 text-[clamp(2rem,6vw,5rem)] leading-tight">{locationName}</h2>
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
