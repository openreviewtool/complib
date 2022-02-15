import React, { useCallback, useEffect, useState } from 'react';
import { MediaAnnotateContext } from '../core/AnnotateCanvas/MediaAnnotateContext';
import { findNextKeyTime, findPrevKeyTime } from '../core/AnnotateCanvas/utils';
import { PanZoomContext } from '../core/PanZoom/PanZoom';
import { normalizeSize } from '../core/PanZoom/utils';
import PlayToolbarComp from '../core/PlayToolbar';
import TimelineComp from '../core/Timeline/Timeline';
import { PlayerContext } from '../core/MediaPlayer/PlayerContext';
import RPlayer from '../core/MediaPlayer/RPlayer';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import './playerComposerStyle.css';

export const Player = (props: { controls?: boolean }) => {
  const ctx = React.useContext(PlayerContext);
  const { setContentSize } = React.useContext(PanZoomContext);

  const { type: mediaType } = ctx.mediaList[ctx.mediaIndex];

  useEffect(() => {
    // this normalization is necessary so the text element include in the
    // embed content does not flutuate.
    // Without it, youtube 320x240 will have 2x font size compare to 640x480
    setContentSize(normalizeSize(ctx.mediaList[ctx.mediaIndex], 1920));
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
    <>
      <RPlayer
        url={ctx.mediaList[ctx.mediaIndex].url}
        playing={ctx.playing}
        volume={ctx.muted ? 0 : 1}
        muted={ctx.muted}
        onPlay={onPlayHandle}
        onPause={onPauseHandle}
        onProgressHiFi={ctx.setPlayerState}
        seekTime={ctx.seekTime}
        onEnded={onPauseHandle}
        controls={props.controls}
      />
    </>
  );
};

const configZeroClamp = { clipDuration: 30, threshold: 1 };

export const Timeline = () => {
  const ctx = React.useContext(PlayerContext);
  const mediaAnnCtx = React.useContext(MediaAnnotateContext);
  const duration =
    ctx.mediaList[ctx.mediaIndex].duration || ctx.playerState.duration;

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

const PlayDeckGradientBackground = () => {
  const { playing } = React.useContext(PlayerContext);

  return (
    <div
      className={`playdeck__shadow playdeck__shadow-${
        playing ? 'hide' : 'show'
      }`}
    />
  );
};

const PlayButton = () => {
  const ctx = React.useContext(PlayerContext);
  const { type: mediaType } = ctx.mediaList[ctx.mediaIndex];

  const showButton = !ctx.seekTimeReady && mediaType === 'video';

  return (
    <div
      className={`playdeck__play_button playdeck__play_button--${
        showButton ? 'show' : 'hide'
      }`}
    >
      <div
        className="playdeck__play_button__button"
        onClick={() => ctx.setPlaying(true)}
      >
        <PlayArrowIcon style={{ color: '#eee', fontSize: '40px' }} />
      </div>
    </div>
  );
};

export const PlayToolbar = () => {
  const ctx = React.useContext(PlayerContext);
  const mediaAnnoCtx = React.useContext(MediaAnnotateContext);
  const markerList = mediaAnnoCtx.annotateTimeList || [];

  return (
    <PlayToolbarComp
      iconSize={'large'}
      playing={ctx.playing}
      onPlay={() => ctx.setPlaying(!ctx.playing)}
      muted={ctx.muted}
      onMuted={() => {
        if (ctx.setMuted) ctx.setMuted(!ctx.muted);
      }}
      fullScreen={ctx.fullScreen}
      onFullScreen={ctx.setFullScreen}
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

export const PlayDeck = () => {
  return (
    <>
      <div className="playdeck__playbutton_layout">
        <PlayDeckGradientBackground />
        <PlayButton />
      </div>
      <div className="playdeck__toolbar">
        <Timeline />
        <PlayToolbar />
      </div>
    </>
  );
};
