import React, { useCallback, useEffect, useState } from 'react';
import { MediaAnnotateContext } from '../core/AnnotateCanvas/MediaAnnotateContext';
import { findNextKeyTime, findPrevKeyTime } from '../core/AnnotateCanvas/utils';
import { normalizeSize } from '../core/PanZoom/utils';
import PlayToolbarComp from '../core/PlayToolbar';
import TimelineComp from '../core/Timeline/Timeline';
import RPlayer from '../core/MediaPlayer/RPlayer';
import {
  PlaybackContext,
  PlayerContext,
} from '../core/MediaPlayer/PlayerContext';
import { PanZoomContext } from '../core/PanZoom/PanZoomContext';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import './playerComposerStyle.css';

export const Player = (props: { controls?: boolean }) => {
  const ctx = React.useContext(PlayerContext);
  const playbackCtx = React.useContext(PlaybackContext);
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
        onProgressHiFi={playbackCtx.setPlayerState}
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
  const playbackCtx = React.useContext(PlaybackContext);
  const mediaAnnCtx = React.useContext(MediaAnnotateContext);
  const duration =
    ctx.mediaList[ctx.mediaIndex].duration || playbackCtx.playerState.duration;
  const isImage = ctx.mediaList[ctx.mediaIndex].type === 'image';
  const showTimeline = !!duration && !isImage;

  return (
    <div style={{ display: ctx.seekTimeReady ? undefined : 'none' }}>
      {showTimeline && (
        <TimelineComp
          currentTime={playbackCtx.playerState.played}
          currentCached={playbackCtx.playerState.loaded}
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

const HoverPlayButton = () => {
  const ctx = React.useContext(PlayerContext);
  const { type: mediaType } = ctx.mediaList[ctx.mediaIndex];

  const showButton = !ctx.seekTimeReady && mediaType !== 'image';

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
  const playbackCtx = React.useContext(PlaybackContext);
  const mediaAnnoCtx = React.useContext(MediaAnnotateContext);
  const markerList = mediaAnnoCtx.annotateTimeList || [];
  const isImage = ctx.mediaList[ctx.mediaIndex].type === 'image';

  return (
    <PlayToolbarComp
      iconSize={'large'}
      //
      playing={ctx.playing}
      onPlay={() => ctx.setPlaying(!ctx.playing)}
      disablePlay={isImage}
      //
      muted={ctx.muted}
      onMuted={() => {
        if (ctx.setMuted) ctx.setMuted(!ctx.muted);
      }}
      disableMute={isImage}
      //
      fullScreen={ctx.fullScreen}
      onFullScreen={ctx.setFullScreen}
      //
      onSkipNext={() => {
        ctx.setMediaIndex((ctx.mediaIndex + 1) % ctx.mediaList.length);
      }}
      disableNext={
        ctx.mediaList.length <= 1 || ctx.mediaIndex === ctx.mediaList.length - 1
      }
      onSkipPrev={() => {
        ctx.setMediaIndex(
          (ctx.mediaIndex - 1 + ctx.mediaList.length) % ctx.mediaList.length,
        );
      }}
      disablePrev={ctx.mediaList.length <= 1 || ctx.mediaIndex === 0}
      //
      onNextAnnotation={() => {
        const nextKey = findNextKeyTime(
          markerList,
          playbackCtx.playerState.played,
        );
        if (nextKey !== null) ctx.setSeekTime(nextKey);
      }}
      disableNextAnnotation={!ctx.seekTimeReady || isImage}
      onPrevAnnotation={() => {
        const prevKey = findPrevKeyTime(
          markerList,
          playbackCtx.playerState.played,
          ctx.playing ? 0.2 : 0,
        );
        if (prevKey !== null) ctx.setSeekTime(prevKey);
      }}
      disablePrevAnnotation={!ctx.seekTimeReady || isImage}
    />
  );
};

export const PlayDeck = () => {
  return (
    <>
      <div className="playdeck__playbutton_layout">
        <PlayDeckGradientBackground />
        <HoverPlayButton />
      </div>
      <div className="playdeck__toolbar">
        <Timeline />
        <PlayToolbar />
      </div>
    </>
  );
};
