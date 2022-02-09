import React, { useEffect, useState } from 'react';
import { MediaInfo, PlayerState } from './types';

interface PlayerContextInteface {
  mediaList: MediaInfo[];
  mediaIndex: number;
  setMediaIndex: (i: number) => void;

  playing: boolean;
  setPlaying: (p: boolean) => void;

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
  seeking: false,
  setSeeking: () => {},
  seekTime: undefined,
  setSeekTime: () => {},
  playerState: { played: 0, loaded: 0, duration: 0 },
  setPlayerState: () => {},

  seekTimeReady: false,
});

export const PlayerContextProvider: React.FC<{
  value: Partial<PlayerContextInteface>;
}> = ({
  value: { mediaList = [], mediaIndex = 0, setMediaIndex = () => {} },
  ...props
}) => {
  const [seekTime, setSeekTime] = useState<number>(); // seek time
  const [playing, setPlaying] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>({
    played: 0,
    loaded: 0,
    duration: 0,
  });

  useEffect(() => {
    // clear the seek time, this is ensure that user can repeatly seek the 
    // same location multiple times.
    const to = window.setTimeout(setSeekTime, 500, undefined)
    return ()=> window.clearTimeout(to)
  }, [seekTime]);

  const seekTimeReady =
    (typeof playerState.loaded === 'number' && playerState.loaded !== 0) ||
    (typeof playerState.played === 'number' && playerState.played !== 0);

  return (
    <PlayerContext.Provider
      value={{
        seekTimeReady,
        mediaList,
        mediaIndex,
        setMediaIndex,
        playing,
        setPlaying,
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