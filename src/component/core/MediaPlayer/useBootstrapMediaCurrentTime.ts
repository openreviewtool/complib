import { useEffect } from 'react';

export default function useBootstrapMediaCurrentTime(
  isPlayingRef: React.RefObject<boolean>,
  playerRef: React.MutableRefObject<{ getCurrentTime: () => number } | null>,
  syncTimeCallBack: (t: number) => void,
) {
  useEffect(() => {
    if (isPlayingRef.current) {
      syncCurrentTime();
    }
  }, [isPlayingRef.current]);

  const syncCurrentTime = () => {
    if (isPlayingRef.current && playerRef.current) {
      // console.log('....set current time', playerRef.current.getCurrentTime())
      syncTimeCallBack(playerRef.current.getCurrentTime());
      // window.requestAnimationFrame(syncCurrentTime);
    }
  };
}
