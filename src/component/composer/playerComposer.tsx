import React, { useCallback, useEffect, useState } from 'react';
import { MediaAnnotateContext } from '../core/AnnotateCanvas/MediaAnnotateContext';
import { findNextKeyTime, findPrevKeyTime } from '../core/AnnotateCanvas/utils';
import { PanZoomContext } from '../core/PanZoom/PanZoom';
import { normalizeSize } from '../core/PanZoom/utils';
import PlayDeckComp from '../core/PlayDeck';
import TimelineComp from '../core/Timeline/Timeline';
import { PlayerContext } from '../core/MediaPlayer/PlayerContext';
import RPlayer from '../core/MediaPlayer/RPlayer';

export const Player = (props: { controls?: boolean }) => {
  const ctx = React.useContext(PlayerContext);
  const { setContentSize } = React.useContext(PanZoomContext);

  const { type: mediaType, provider_name } = ctx.mediaList[ctx.mediaIndex];

  useEffect(() => {
    // this normalization is necessary so the text element include in the
    // embed content does not flutuate.
    // Without it, youtube 320x240 will have 2x font size compare to 640x480
    setContentSize(normalizeSize(ctx.mediaList[ctx.mediaIndex], 1000));
  }, [ctx.mediaIndex]);

  const onPlayHandle = useCallback(() => ctx.setPlaying(true), []);
  const onPauseHandle = useCallback(() => ctx.setPlaying(false), []);

  return mediaType === 'image' ? (
    <img
      style={{
        height: '100%',
        width: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      src={ctx.mediaList[ctx.mediaIndex].url}
    />
  ) : (
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
  const mediaAnnCtx = React.useContext(MediaAnnotateContext);
  const duration = ctx.mediaList[ctx.mediaIndex].duration;

  return (
    <div style={{ display: ctx.seekTimeReady ? undefined : 'none' }}>
      {!!duration && (
        <TimelineComp
          currentTime={ctx.playerState.played}
          currentCached={ctx.playerState.loaded}
          duration={duration}
          onTimelineSeek={ctx.setSeekTime}
          timelineCaptured={ctx.seeking}
          onTimelineCaptured={ctx.setSeeking}
          zeroClamp={configZeroClamp}
          markerList={mediaAnnCtx.annotateTimeList}
        />
      )}
    </div>
  );
};

export const PlayDeck = () => {
  const ctx = React.useContext(PlayerContext);
  const mediaAnnoCtx = React.useContext(MediaAnnotateContext);
  const markerList = mediaAnnoCtx.annotateTimeList || [];

  return (
    <PlayDeckComp
      iconSize={'large'}
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
