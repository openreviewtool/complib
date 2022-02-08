import { boolean } from '@storybook/addon-knobs';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AnnotateContext,
  findNextKeyTime,
  findPrevKeyTime,
} from '../AnnotateCanvas/annotateComposer';
import { PanZoomContext } from '../PanZoom/PanZoom';
import { normalizeSize } from '../PanZoom/utils';
import PlayDeckComp from '../PlayDeck';
import TimelineComp from '../Timeline/Timeline';
import RPlayer from './RPlayer';
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
  playerState: { played: number; loaded: number };
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
  playerState: { played: 0, loaded: 0 },
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

export const Player = (props: { controls?: boolean }) => {
  const ctx = React.useContext(PlayerContext);
  const { setContentSize } = React.useContext(PanZoomContext);

  useEffect(() => {
    setContentSize(normalizeSize(ctx.mediaList[ctx.mediaIndex], 1000));
  }, [ctx.mediaIndex]);

  const onPlayHandle = useCallback(() => ctx.setPlaying(true), []);
  const onPauseHandle = useCallback(() => ctx.setPlaying(false), []);


  return (
    <RPlayer
      url={ctx.mediaList[ctx.mediaIndex].url}
      playing={ctx.playing}
      onPlay={onPlayHandle}
      onPause={onPauseHandle}
      onProgressHiFi={ctx.setPlayerState}
      seekTime={ctx.seekTime}
      onEnded={onPauseHandle}
      controls={props.controls}
    />
  );
};

const configZeroClamp = { clipDuration: 30, threshold: 1 };

export const Timeline = () => {
  const ctx = React.useContext(PlayerContext);
  const annotateCtx = React.useContext(AnnotateContext);

  return (
    <div style={{ display: ctx.seekTimeReady ? undefined : 'none' }}>
      <TimelineComp
        currentTime={ctx.playerState.played}
        currentCached={ctx.playerState.loaded}
        duration={ctx.mediaList[ctx.mediaIndex].duration}
        onTimelineSeek={ctx.setSeekTime}
        timelineCaptured={ctx.seeking}
        onTimelineCaptured={ctx.setSeeking}
        zeroClamp={configZeroClamp}
        markerList={annotateCtx.annotateTimeList}
      />
    </div>
  );
};

export const PlayDeck = () => {
  const ctx = React.useContext(PlayerContext);
  const annotateCtx = React.useContext(AnnotateContext);
  const markerList = annotateCtx.annotateTimeList || [];

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
      onNextAnnotation={
        ctx.seekTimeReady
          ? () => {
              const nextKey = findNextKeyTime(
                markerList,
                ctx.playerState.played,
              );
              if (nextKey !== null) ctx.setSeekTime(nextKey);
            }
          : undefined
      }
      onPrevAnnotation={() => {
        const prevKey = findPrevKeyTime(markerList, ctx.playerState.played);
        if (prevKey !== null) ctx.setSeekTime(prevKey);
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
