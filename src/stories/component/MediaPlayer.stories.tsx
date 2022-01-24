import React, { useEffect, useState } from 'react';
import { mediaSamplesWithLabel as mediaList } from '../testdata/mediaSamples';
import { button, select } from '@storybook/addon-knobs';
import RPlayer from '../../component/core/MediaPlayer/RPlayer';
import PlayDeck, {
  PlayDeckProps,
} from '../../component/core/PlayDeck/PlayDeck';
import Timeline from '../../component/core/Timeline';
import { MediaInfo, PlayerState } from '../../component/core/MediaPlayer/types';
import { TimelineProps } from '../../component/core/Timeline/Timeline';
import { composeMediaPlayer } from '../../component/core/MediaPlayer/composer';

const story = {
  title: 'MediaPlayer',
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

  return composeMediaPlayer(
    mediaList,
    mediaIndex,
    setMediaIndex,
    Timeline,
    PlayDeck,
  );
};

// the stop watch is for testing only, and should not be included in the story.
Default.parameters = { layout: 'fullscreen' };
export default story;
