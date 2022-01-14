import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import AnnotateCanvas from '../AnnotateCanvas';
import { AnnotateElement } from '../AnnotateCanvas/types';
import PanZoom from '../PanZoom';
import PlayDeck from '../PlayDeck';
import Timeline from '../Timeline';

import { MediaInfo } from './types';

export interface MediaPlayerProps {
  media: MediaInfo;

  annotations?: AnnotateElement[];
  annotateCanvasBound?: number | { width: number; height: number };
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  annotateCanvasBound = 1280,
  ...props
}) => {
  const reactPlayerRef = useRef<ReactPlayer | null>(null);

  const playingMediaUrlRef = useRef<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: -1, height: -1 });

  const [currentTime, setCurrentTime] = useState(0);
  const [pause, setPause] = useState(true);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    setCanvasSize({
      width: annotateCanvasBound as number,
      height:
        (annotateCanvasBound as number) *
        (props.media.height / props.media.width),
    });
    playingMediaUrlRef.current = null;
  }, [props.media]);

  const reactPlayer = (
    <ReactPlayer
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
      }}
      width={'100%'}
      height={'100%'}
      url={props.media?.url}
      // config={playerConfig}
      playing={!pause}
      onReady={(player) => (reactPlayerRef.current = player)}
      loop={loop}
      // onEnded={props.onEnded}
      onPlay={() => {
        // // work around for vimeo content where calling seekTo on a (uncached) portion can trigger playback.
        // if (
        //   props.timelineCaptured &&
        //   props.media &&
        //   props.media.provider_name === 'Vimeo'
        // ) {
        //   reactPlayerRef.current?.getInternalPlayer().pause();
        //   console.warn(
        //     'Vimeo attempted to do trigger playback while user is seeking.',
        //   );
        // }

        playingMediaUrlRef.current = reactPlayerRef.current?.props
          .url as string;
      }}
    />
  );

  const annotateCanvas = props.annotations && (
    <AnnotateCanvas
      elements={props.annotations}
      width={canvasSize.width}
      height={canvasSize.height}
      // selection={[]}
      // uiState={uiDefaults}
    />
  );

  const annotateWithPanZoom = (
    <PanZoom
      disablePan={false}
      contentSize={{ width: props.media.width, height: props.media.height }}
    >
      <div style={{ ...canvasSize, position: 'absolute' }}>{reactPlayer}</div>
      {annotateCanvas}
    </PanZoom>
  );

  const timeline = (
    <Timeline
      duration={props.media?.duration || 1}
      currentTime={currentTime}
      // onTimelineSeek={props?.onTimelineSeek}
      // onTimelineCapture={props?.onTimelineCaptured}
    />
  );

  const playDeck = (
    <PlayDeck
      playing={!pause}
      onPlay={() => setPause(!pause)}
      onToggleLoop={() => setLoop(!loop)}
    />
  );

  const playDeckWithTimeline = (
    <div
      id="playControlPanel"
      style={{ position: 'absolute', width: '100%', bottom: '0px' }}
    >
      {timeline}
      {playDeck}
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {annotateWithPanZoom}
      {playDeckWithTimeline}
    </div>
  );
};

export default MediaPlayer;
