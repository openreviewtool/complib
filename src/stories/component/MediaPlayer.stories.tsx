import React, { useEffect, useState } from 'react';
import { mediaSamplesWithLabel as mediaList } from '../testdata/mediaSamples';
import { select } from '@storybook/addon-knobs';
import RPlayer from '../../component/core/MediaPlayer/RPlayer';
import * as playerComposer from '../../component/composer/playerComposer';
import { PlayerContextProvider } from '../../component/core/MediaPlayer/PlayerContext';

const story = {
  title: 'Components/MediaPlayer',
};

export const Default = (): JSX.Element => {
  const mediaKnob = select('Video', mediaList, mediaList[0]);
  return <RPlayer url={mediaKnob.url} controls={true} />;
};

export const CustomControls = (): JSX.Element => {
  const [mediaIndex, setMediaIndex] = useState(0);
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
      <PlayerContextProvider
        value={{ mediaList, mediaIndex, setMediaIndex }}
      >
        <div>
          <playerComposer.Player />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <playerComposer.Timeline />
            <playerComposer.PlayDeck />
          </div>
        </div>
      </PlayerContextProvider>
    </div>
  );
};

// the stop watch is for testing only, and should not be included in the story.
Default.parameters = { layout: 'fullscreen' };
export default story;
