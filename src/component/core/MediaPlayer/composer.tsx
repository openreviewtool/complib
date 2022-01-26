import React, { useEffect, useState } from 'react';
import PlayDeckComp from '../PlayDeck';
import TimelineComp from '../Timeline/Timeline';
import RPlayer from './RPlayer';
import { MediaInfo, PlayerState } from './types';

interface playerContextInteface {
  mediaList: MediaInfo[];
  mediaIndex: number;
  setMediaIndex: (i: number) => void;

  playing: boolean;
  setPlaying: (p: boolean) => void;

  seekTime?: number;
  setSeekTime: (t: number | undefined) => void;

  playerState: { played: number; loaded: number };
  setPlayerState: (p: PlayerState) => void;
}

export const PlayerContext = React.createContext<playerContextInteface>({
  mediaList: [],
  mediaIndex: 0,
  setMediaIndex: () => {},
  playing: false,
  setPlaying: () => {},
  seekTime: undefined,
  setSeekTime: () => {},
  playerState: { played: 0, loaded: 0 },
  setPlayerState: () => {},
});

export const PlayerContextProvider: React.FC<{
  value: Partial<playerContextInteface>;
}> = ({
  value: {
    mediaList = [],
    mediaIndex = 0,
    setMediaIndex = () => {},
  },
  ...props
}) => {
  const [seekTime, setSeekTime] = useState<number>(); // seek time
  const [playing, setPlaying] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>({
    played: 0,
    loaded: 0,
  });

  return (
    <PlayerContext.Provider
      value={{
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

export const Player = () => {
  const ctx = React.useContext(PlayerContext);
  return (
    <RPlayer
      url={ctx.mediaList[ctx.mediaIndex].url}
      playing={ctx.playing}
      onPlay={() => ctx.setPlaying(true)}
      onPause={() => ctx.setPlaying(false)}
      onProgressHiFi={(s) => {
        ctx.setPlayerState(s);
      }}
      seekTime={ctx.seekTime}
      onEnded={() => ctx.setPlaying(false)}
    />
  );
};

export const Timeline = () => {
  const ctx = React.useContext(PlayerContext);
  const showTimeline =
    (typeof ctx.playerState.loaded === 'number' &&
      ctx.playerState.loaded !== 0) ||
    (typeof ctx.playerState.played === 'number' &&
      ctx.playerState.played !== 0);

  return (
    <div style={{ display: showTimeline ? undefined : 'none' }}>
      <TimelineComp
        currentTime={ctx.playerState.played}
        duration={ctx.mediaList[ctx.mediaIndex].duration}
        onTimelineSeek={ctx.setSeekTime}
        onTimelineCaptured={(captured) => {
          // this is to enabled repeatly seeking same spot.
          if (!captured) ctx.setSeekTime(undefined);
        }}
      />
    </div>
  );
};

export const PlayDeck = () => (
  <PlayerContext.Consumer>
    {(ctx) => {
      return (
        <PlayDeckComp
          playing={ctx.playing}
          onPlay={() => ctx.setPlaying(!ctx.playing)}
          onSkipNext={() => {
            ctx.setMediaIndex((ctx.mediaIndex + 1) % ctx.mediaList.length);
          }}
          onSkipPrev={() => {
            ctx.setMediaIndex(
              (ctx.mediaIndex - 1 + ctx.mediaList.length) % ctx.mediaList.length,
            );
          }}
        />
      );
    }}
  </PlayerContext.Consumer>
);