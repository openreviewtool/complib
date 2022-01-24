import { boolean } from '@storybook/addon-knobs';
import React from 'react';

const StoryHint: React.FC<{ hint: JSX.Element, width?: number }> = ({
  hint = 'Some description about this story.',
  width = 150, 
  ...props
}) => {
  const displayHintKnob = boolean('Show Hint', true);
  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap', height: '100vh' }}>
      <div
        id="side_panel"
        style={{
          background: 'gray',
          width: displayHintKnob ? 150 : 0,
          height: '100%',
          transition: '0.25s',
          overflow: 'hidden',
          transitionTimingFunction: 'ease-out',
        }}
      >
        <div
          style={{
            width: 150,
            boxSizing: 'border-box',
            padding: 5,
          }}
        >
          {hint}
        </div>
      </div>
      <div style={{ flexGrow: 1, position: 'relative' }}>{props.children}</div>
    </div>
  );
};

export default StoryHint;
