import React from 'react';

interface StopWatchProps {
  text: string;
  color?: string;
  displayTimeInputRef?: React.RefObject<HTMLInputElement>;
}

//const StopWatch = (props: StopWatchProps) => {
const StopWatch: React.FC<StopWatchProps> = ({text,color,displayTimeInputRef}) => {
  // const [interval, setInterval] = React.useState<number | null>(null)
  const [displayTime, setDisplayTime] = React.useState<string>('');
  const displayTimer = React.useRef<number | null>(null);
  const startTime = React.useRef<Date | null>(null);

  React.useEffect(() => {
    toggleClock();
    return () => {
      if (displayTimer.current !== null) {
        window.clearInterval(displayTimer.current);
      }
    };
  }, []);

  const toggleClock = () => {
    if (displayTimer.current !== null) {
      window.clearInterval(displayTimer.current);
      setDisplayTime('0');
      displayTimer.current = null;
    } else {
      startTime.current = new Date();

      displayTimer.current = window.setInterval(() => {
        setDisplayTime(
          (
            (new Date().getTime() - startTime.current!.getTime()) /
            1000
          ).toFixed(2),
        );
      }, 100);
    }
  };

  return (
    <>
      <div style={{ color: color }}>{text}</div>
      <input ref={displayTimeInputRef} type="text" defaultValue={displayTime} />
      <button onClick={(e) => toggleClock()}>
        {displayTime === '0' ? 'Start' : 'Pause'}
      </button>
    </>
  );
};

export default StopWatch;
