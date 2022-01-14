import React, { useState } from 'react';

import { select, boolean } from '@storybook/addon-knobs';
import PanZoom from '../../component/core/PanZoom';
import AnnotateCanvas from '../../component/core/AnnotateCanvas';
import { sampleAnnotations } from '../testdata/annotationSamples';

const story = {
  title: 'PanZoom',
};

const mediaUrls = [
  // 'data:image/png;base64,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',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Youngkitten.JPG/320px-Youngkitten.JPG',
];

export const Default = (): JSX.Element => {
  const videoUrlKnob = select('Media URL', mediaUrls, mediaUrls[0]);
  const disabled = boolean('Disabled', false);
  const [contentSize, setContentSize] = useState({
    width: 10,
    height: 10,
  });

  const onImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    setContentSize({
      width: event.currentTarget.width,
      height: event.currentTarget.height,
    });
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap', height: '100vh' }}>
      <div
        id="side_panel"
        style={{ background: 'gray', width: '150px', height: '100%' }}
      >
        side panel
      </div>
      <div
        style={{
          overflow: 'clip',
          position: 'relative',
          background: 'black',
          flexGrow: 1,
        }}
      >
        <PanZoom contentSize={contentSize} disabled={disabled}>
          <img
            style={{ display: 'block' }}
            src={videoUrlKnob}
            alt="test"
            onLoad={onImageLoad}
          />
        </PanZoom>
      </div>
    </div>
  );
};

export const WithAnnotation = (): JSX.Element => {
  const [contentSize, setContentSize] = useState({
    width: 10,
    height: 10,
  });

  const onImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    setContentSize({
      width: event.currentTarget.width,
      height: event.currentTarget.height,
    });
  };

  return (
    <PanZoom contentSize={contentSize}>
      <div style={{ position: 'absolute' }}>
        <img src={mediaUrls[0]} alt="test" onLoad={onImageLoad} />
      </div>
      <div style={{ position: 'absolute' }}>
        <AnnotateCanvas
          elements={sampleAnnotations}
          width={contentSize.width}
          height={contentSize.height}
        />
      </div>
      <div
        style={{
          height: contentSize.height,
          width: contentSize.width,
          background: 'green',
        }}
      />
    </PanZoom>
  );
};

Default.parameters = { layout: 'fullscreen' };
WithAnnotation.parameters = { layout: 'fullscreen' };
export default story;
