
import Clock from "@/app/components/Clock";
import Weather from "@/app/components/Weather";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export default function Home() {
  return (
    <>
      <ThemeSwitcher />
      <main className="flex h-screen flex-col items-center justify-center bg-[var(--bg-color)] p-8">
        <div className="flex h-full w-full max-w-screen-2xl flex-row items-stretch justify-center gap-4 p-4 sm:p-6 lg:p-8">
          {/* Clock Section (60%) */}
          <div className="flex flex-[3] items-start justify-center rounded-md p-4 pt-8">
            <Clock />
          </div>
          
          {/* Weather Section (40%) */}
          <div className="flex flex-[2] items-start justify-center rounded-md p-4 pt-8">
            <Weather />
          </div>
        </div>
      </main>
    </>
  );
}
