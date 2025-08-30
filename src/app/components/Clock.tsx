'use client';

import { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { hour12: false });
  };

  const renderContent = () => {
    if (!isMounted) {
      return (
        <>
          <div className="themed-text mb-4 text-[clamp(2.5rem,8vw,6rem)] leading-none">
            --/-- (--)
          </div>
          <div className="themed-text font-bold tracking-widest text-[clamp(4rem,18vw,14rem)] leading-none">
            --:--:--
          </div>
        </>
      );
    }
    return (
      <>
        <div className="themed-text mb-4 text-[clamp(2.5rem,8vw,6rem)] leading-none">
          {formatDate(time)}
        </div>
        <div className="themed-text font-bold tracking-widest text-[clamp(4rem,18vw,14rem)] leading-none">
          {formatTime(time)}
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      {renderContent()}
    </div>
  );
};

export default Clock;