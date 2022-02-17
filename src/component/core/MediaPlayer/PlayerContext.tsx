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

  seekTimeReady: boolean;
}

interface PlaybackContextInteface {
  // in seconds
  playerState: { played: number; loaded: number; duration: number };
  setPlayerState: (p: PlayerState) => void;
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

  seekTimeReady: false,
});

export const PlaybackContext = React.createContext<PlaybackContextInteface>({
  playerState: { played: 0, loaded: 0, duration: 0 },
  setPlayerState: () => {},
});

export const PlayerContextProvider: React.FC<{
  mediaList: MediaInfo[];
  mediaIndex: number;
  setMediaIndex: (i: number) => void;
  fullScreen?: boolean;
  setFullScreen?: () => void;
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

  const seekTimeReady =
    !!playerState.loaded || (!!playerState.played && playerState.played !== 0);

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
      }}
    >
      <PlaybackContext.Provider
        value={{
          playerState,
          setPlayerState,
        }}
      >
        {props.children}
      </PlaybackContext.Provider>
    </PlayerContext.Provider>
  );
};
