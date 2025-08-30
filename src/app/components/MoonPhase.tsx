'use client';

import { Moon } from 'lunarphase-js';
import { useEffect, useState } from 'react';

interface MoonPhaseProps {
  date: Date;
}

const MoonPhase = ({ date }: MoonPhaseProps) => {
  const [phaseName, setPhaseName] = useState('');
  const [phaseEmoji, setPhaseEmoji] = useState('');

  useEffect(() => {
    // lunarphase-js uses the current date if none is provided, so we pass it explicitly
    const moonPhase = Moon.lunarPhase(date);
    const moonEmoji = Moon.lunarPhaseEmoji(date);
    setPhaseName(moonPhase);
    setPhaseEmoji(moonEmoji);
  }, [date]);

  if (!phaseName) {
    return null; // Or a loading indicator
  }

  return (
    <div className="themed-text mt-2 flex flex-col items-center text-center">
      <div className="text-[clamp(1.2rem,3vw,2rem)] leading-tight">
        {phaseEmoji} {phaseName}
      </div>
    </div>
  );
};

export default MoonPhase;
