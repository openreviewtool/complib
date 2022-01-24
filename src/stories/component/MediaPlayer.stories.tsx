import React, { useEffect, useState } from 'react';
import { mediaSamplesWithLabel as mediaList } from '../testdata/mediaSamples';
import { button, select } from '@storybook/addon-knobs';
import RPlayer from '../../component/core/MediaPlayer/RPlayer';
import PlayDeck from '../../component/core/PlayDeck/PlayDeck';
import Timeline from '../../component/core/Timeline';
import { PlayerState } from '../../component/core/MediaPlayer/types';

const story = {
  title: 'MediaPlayer',
};

export const Default = (): JSX.Element => {
  const mediaKnob = select('Video', mediaList, mediaList[0]);
  return <RPlayer url={mediaKnob.url} controls={true} />;
};

export const CustomControls = (): JSX.Element => {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seekTime, setSeekTime] = useState<number>(); // seek time
  const [pState, setPState] = useState<PlayerState>({ played: 0, loaded: 0 });

  const mediaKnob = select('Video', mediaList, mediaList[mediaIndex]);

  useEffect(() => {
    const index = mediaList.reduce((a, c, i) => {
      if (c.label === mediaKnob.label) a = i;
      return a;
    }, 0);
    setMediaIndex(index);
  }, [mediaKnob]);

  return (
    <div>
      <RPlayer
        url={mediaList[mediaIndex].url}
        playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onProgressHiFi={setPState}
        seekTime={seekTime}
        onEnded={()=>setPlaying(false)}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        {(pState.loaded !== 0 || pState.played !== 0) && (
          <Timeline
            currentTime={pState.played}
            duration={mediaList[mediaIndex].duration}
            onTimelineSeek={setSeekTime}
            onTimelineCaptured={(captured) => {
              if (!captured) setSeekTime(undefined);
            }}
          />
        )}
        <PlayDeck
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          onSkipNext={() => {
            setMediaIndex((mediaIndex + 1) % mediaList.length);
          }}
          onSkipPrev={() => {
            setMediaIndex(
              (mediaIndex - 1 + mediaList.length) % mediaList.length,
            );
          }}
        />
      </div>
    </div>
  );
};

// the stop watch is for testing only, and should not be included in the story.
Default.parameters = { layout: 'fullscreen' };
export default story;
