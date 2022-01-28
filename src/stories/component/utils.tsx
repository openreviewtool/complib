import { boolean, optionsKnob, select } from '@storybook/addon-knobs';
import React from 'react';
import { isTablet } from '../../component/utils/browser';

export const StoryHint: React.FC<{ hint: JSX.Element; width?: number }> = ({
  hint = 'Some description about this story.',
  width = 150,
  ...props
}) => {
  const displayHintKnob = boolean('Show Hint', true);
  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap', height: '100vh', maxHeight: isTablet()? '650px': undefined }}>
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

export const getAnnotateKnobs = () => {
  return {
    resolutionKnob: select('Annotate resolution', [800, 1280, 1920], 800),
    modeKnob: optionsKnob(
      'Mode',
      {
        PanZoom: 'panZoom',
        Selection: 'selection',
        Annotate: 'draw',
      },
      'panZoom',
      { display: 'inline-radio' },
    ),
  };
};
