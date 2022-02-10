import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { PlayerState } from './types';

export interface RPlayerProps extends ReactPlayerProps {
  seekTime?: number;
  onProgressHiFi?: (s: PlayerState) => void;
}

const RPlayer: React.FC<RPlayerProps> = ({
  seekTime = undefined,
  onProgressHiFi = undefined,
  ...props
}) => {
  const reactPlayerRef = useRef<ReactPlayer>(null);
  const syncTimeIdRef = useRef<number | null>(null);
  const lastBroadcastTimeRef = useRef<{
    played: number;
    loaded: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    if (reactPlayerRef.current && seekTime!==undefined && seekTime >= 0) {
      if (reactPlayerRef.current.getInternalPlayer().nodeName === 'VIDEO') {
        reactPlayerRef.current.getInternalPlayer().currentTime = seekTime;
      } else {
        reactPlayerRef.current.seekTo(seekTime);
      }
    }
  }, [seekTime]);

  useEffect(() => {
    if (syncTimeIdRef.current) {
      window.clearTimeout(syncTimeIdRef.current);
      syncTimeIdRef.current = null;
    }

    if (onProgressHiFi && reactPlayerRef.current) {
      syncTimeIdRef.current = window.setInterval(() => {
        if (reactPlayerRef.current) {
          const played = reactPlayerRef.current.getCurrentTime();
          const loaded = reactPlayerRef.current.getSecondsLoaded();
          const duration = reactPlayerRef.current.getDuration();
          if (
            played !== lastBroadcastTimeRef.current?.played ||
            loaded !== lastBroadcastTimeRef.current?.loaded
          ) {
            onProgressHiFi({loaded, played, duration});
          }
          lastBroadcastTimeRef.current = { played, loaded, duration };
        }
      }, 20);
    }
    return () => {
      if (syncTimeIdRef.current) {
        window.clearInterval(syncTimeIdRef.current);
      }
    };
  }, [reactPlayerRef.current]);

  return (
    <ReactPlayer
      ref={reactPlayerRef}
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        overflow: 'hidden',
      }}
      width={'100%'}
      height={'100%'}
      {...props}
    />
  );
};

export default RPlayer;
