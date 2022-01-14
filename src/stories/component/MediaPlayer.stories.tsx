import React from 'react';
import { button } from '@storybook/addon-knobs';
import MediaPlayer from '../../component/core/MediaPlayer';
import { mediaSamples } from '../testdata/mediaSamples';

const story = {
  title: 'MediaPlayer',
};

export const Default = (): JSX.Element => {
  const stopWatchTimeDisplayInputRef = React.createRef<HTMLInputElement>();

  button('Tell time using Ref', () => {
    alert(stopWatchTimeDisplayInputRef.current?.value);
  });

  return (
    <MediaPlayer
      media={mediaSamples[0]}
      
    />
  );
};

// the stop watch is for testing only, and should not be included in the story.
Default.parameters = { layout: 'fullscreen' };
export default story;
