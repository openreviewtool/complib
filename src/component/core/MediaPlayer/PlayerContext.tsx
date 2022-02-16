import React, { useEffect, useState } from 'react';
import { MediaInfo, PlayerState } from './types';

interface PlayerContextInteface {
  mediaList: MediaInfo[];
  mediaIndex: number;
  setMediaIndex: (i: number) => void;

  playing: boolean;
  setPlaying: (p: boolean) => void;

  muted?: boolean;
  setMuted?: (m: boolean) => void;

  fullScreen?: boolean;
  setFullScreen?: () => void;

  seekTime?: number;
  setSeekTime: (t: number | undefined) => void;

  seeking?: boolean;
  setSeeking?: (s: boolean) => void;

  // in seconds
  playerState: { played: number; loaded: number; duration: number };
  setPlayerState: (p: PlayerState) => void;

  seekTimeReady: boolean;
}

export const PlayerContext = React.createContext<PlayerContextInteface>({
  mediaList: [],
  mediaIndex: 0,
  setMediaIndex: () => {},
  playing: false,
  setPlaying: () => {},
  muted: false,
  setMuted: () => {},
  fullScreen: false,
  setFullScreen: () => {},
  seeking: false,
  setSeeking: () => {},
  seekTime: undefined,
  setSeekTime: () => {},
  playerState: { played: 0, loaded: 0, duration: 0 },
  setPlayerState: () => {},

  seekTimeReady: false,
});

export const PlayerContextProvider: React.FC<{
  mediaList: MediaInfo[];
  mediaIndex: number;
  setMediaIndex: (i: number) => void;
  fullScreen?: boolean;
  setFullScreen?: ()=>void;
}> = (props) => {
  const [seekTime, setSeekTime] = useState<number>(); // seek time
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>({
    played: 0,
    loaded: 0,
    duration: 0,
  });

  useEffect(() => {
    // clear the seek time, this is ensure that user can repeatly seek the
    // same location multiple times.
    const to = window.setTimeout(setSeekTime, 500, undefined);
    return () => window.clearTimeout(to);
  }, [seekTime]);

  const seekTimeReady = !!playerState.loaded || (!!playerState.played && playerState.played!==0);

  return (
    <PlayerContext.Provider
      value={{
        ...props,
        seekTimeReady,
        playing,
        setPlaying,
        muted,
        setMuted,       
        seekTime,
        setSeekTime,
        playerState,
        setPlayerState,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};
