export const formatTimeDisplay = (time: number, duration: number) => {
  const mSec = new Date(time * 1000);
  const mSecStr = mSec.toISOString();

  if (duration > 60) {
    const result = [];
    const hour = mSec.getHours() - 19;
    const min = mSec.getMinutes();
    const sec = (mSec.getSeconds() + mSec.getMilliseconds() / 1000).toFixed(0).padStart(2, '0')

    if (hour) {
      result.push(hour);
    }

    result.push(hour ? min.toString().padStart(2, '0') : min);
    result.push( sec )

    return result.join(':')

  // } else if (duration > 60) {
  //   return `${mSec.getMinutes()}:${(
  //     mSec.getMilliseconds() / 1000 +
  //     mSec.getSeconds()
  //   )
  //     .toFixed(0)
  //     .padStart(2, '0')}`;
  } else {
    return time.toFixed(1);
  }
};
