
import Image from 'next/image';

interface HourlyForecastProps {
  hourlyData: {
    dt: number;
    weather: {
      icon: string;
    };
  }[];
}

const HourlyForecast = ({ hourlyData }: HourlyForecastProps) => {
  return (
    <div className="themed-text mt-8 flex w-full max-w-lg justify-around px-4">
      {hourlyData.map((hour, index) => (
        <div key={hour.dt} className="flex flex-col items-center text-center">
          <div className="mb-2 text-[clamp(1rem,3vw,1.2rem)]">
            {index * 6}:00
          </div>
          <Image 
            src={`https://openweathermap.org/img/wn/${hour.weather.icon}@2x.png`}
            alt="Hourly weather icon"
            width={60} // Intrinsic width
            height={60} // Intrinsic height
            className="themed-text h-auto w-[clamp(40px,10vw,60px)]"
          />
        </div>
      ))}
    </div>
  );
};

export default HourlyForecast;
