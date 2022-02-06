import React, { useCallback, useEffect, useState } from 'react';
import { PanZoomContext } from '../PanZoom/PanZoom';
import { normalizeSize } from '../PanZoom/utils';
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

  seeking?: boolean;
  setSeeking?: (s: boolean) => void;

  playerState: { played: number; loaded: number };
  setPlayerState: (p: PlayerState) => void;
}

export const PlayerContext = React.createContext<playerContextInteface>({
  mediaList: [],
  mediaIndex: 0,
  setMediaIndex: () => {},
  playing: false,
  setPlaying: () => {},
  seeking: false,
  setSeeking: () => {},
  seekTime: undefined,
  setSeekTime: () => {},
  playerState: { played: 0, loaded: 0 },
  setPlayerState: () => {},
});

export const PlayerContextProvider: React.FC<{
  value: Partial<playerContextInteface>;
}> = ({
  value: { mediaList = [], mediaIndex = 0, setMediaIndex = () => {} },
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

export const Player = (props: { controls?: boolean }) => {
  const ctx = React.useContext(PlayerContext);
  const { setContentSize } = React.useContext(PanZoomContext);

  useEffect(() => {
    setContentSize(normalizeSize(ctx.mediaList[ctx.mediaIndex], 1000));
  }, [ctx.mediaIndex]);

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
      controls={props.controls || false}
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
        timelineCaptured={ctx.seeking}
        onTimelineCaptured={(captured) => {
          // this is to enabled repeatly seeking same spot.
          if (!captured) ctx.setSeekTime(undefined);
          if (ctx.setSeeking) ctx.setSeeking(captured);
        }}
        zeroClamp = {{clipDuration: 30, threshold: 1}}
      />
    </div>
  );
};

export const PlayDeck = () => {
  const ctx = React.useContext(PlayerContext);
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
};

export const PlayDeckWithTimeline = () => {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <Timeline />
      <PlayDeck />
    </div>
  );
};
