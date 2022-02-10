export const formatTimeDisplay = (time: number, duration: number) => {
  const mSec = new Date(time * 1000).toISOString();

  if (duration > 3600) {
    return mSec.substr(11, 8);
  } else if (duration > 60) {
    const [min, sec] = mSec.substr(14, 5).split(':');
    return `${parseInt(min)}:${sec}`;
  } else {
    return time.toFixed(1);
  }
};