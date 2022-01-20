import React, { useState } from 'react';

import { select, boolean } from '@storybook/addon-knobs';
import PanZoom from '../../component/core/PanZoom';
import AnnotateCanvas from '../../component/core/AnnotateCanvas/AnnotateCanvas';
import { sampleAnnotations } from '../testdata/annotationSamples';
import {
  PanZoomContent,
  PanZoomOverlay,
} from '../../component/core/PanZoom/PanZoom';
import { normalizeScale } from '../../component/core/PanZoom/utils';
import { artUrls } from '../testdata/mediaSamples';

const story = {
  title: 'PanZoom',
};

export const Default = (): JSX.Element => {
  const videoUrlKnob = select('Media URL', artUrls, artUrls[0]);
  const disabled = boolean('Disabled', false);

  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap', height: '100vh' }}>
      <div
        id="side_panel"
        style={{
          paddingLeft: '10px',
          background: 'gray',
          width: '150px',
          height: '100%',
        }}
      >
        <p>
          <b>Tablet</b>: pan and zoom using two fingers
        </p>
        <p>
          <b>Laptop</b>: zoom using mouse wheel or using two finger gesture on
          trackpad
        </p>
      </div>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <PanZoom disabled={disabled}>
          <PanZoomContent
            render={(setContentSize) => (
              <img
                src={videoUrlKnob}
                onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  setContentSize({
                    width: e.currentTarget.width,
                    height: e.currentTarget.height,
                  });
                }}
              />
            )}
          />
        </PanZoom>
      </div>
    </div>
  );
};

export const WithAnnotation = (): JSX.Element => {
  const videoUrlKnob = select('Media URL', artUrls, artUrls[0]);
  const resKnob = select('Annotate resolution', [800, 1280, 1920], 800);
  const modeKnob = select('Mode', ['PanZoom', 'Annotate'], 'PanZoom');

  return (
    <PanZoom disabled={modeKnob !== 'PanZoom'}>
      <PanZoomContent
        render={(setContentSize) => (
          <img
            src={videoUrlKnob}
            onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
              setContentSize({
                width: e.currentTarget.width,
                height: e.currentTarget.height,
              });
            }}
          />
        )}
      />
      <PanZoomOverlay
        render={(panZoom, contentSize, containerSize, inProgress) => {
          console.log('.....panzoom', panZoom)
          return (
            <AnnotateCanvas
              elements={sampleAnnotations}
              width={containerSize.width}
              height={containerSize.height}
              panZoom={{
                ...panZoom,
                scale: normalizeScale(contentSize, panZoom.scale, resKnob),
              }}
              // disabled={inProgress}
              disabled={modeKnob !== 'Annotate'}
            />
          );
        }}
      />
    </PanZoom>
  );
};

Default.parameters = { layout: 'fullscreen' };
WithAnnotation.parameters = { layout: 'fullscreen' };
export default story;
