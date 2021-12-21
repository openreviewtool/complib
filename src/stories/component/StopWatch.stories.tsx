import React from 'react';
import StopWatch from '../../component/core/StopWatch';
import { button } from '@storybook/addon-knobs';

const story = {
  title: 'Components/StopWatch',
};

export const Default = (): JSX.Element => {
  const stopWatchTimeDisplayInputRef = React.createRef<HTMLInputElement>();

  button('Tell time using Ref', () => {
    alert(stopWatchTimeDisplayInputRef.current?.value);
  });

  return (
    <StopWatch
      displayTimeInputRef={stopWatchTimeDisplayInputRef}
      text="hello, world"
      color="#00ff00"
    />
  );
};

// the stop watch is for testing only, and should not be included in the story.
// export default story;
