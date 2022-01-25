import React, { useEffect, useState } from 'react';

import { select, boolean } from '@storybook/addon-knobs';
import PanZoom from '../../component/core/PanZoom';
import AnnotateCanvas from '../../component/core/AnnotateCanvas/AnnotateCanvas';
import { sampleAnnotations } from '../testdata/annotationSamples';
import {
  PanZoomContent,
  PanZoomOverlay,
} from '../../component/core/PanZoom/PanZoom';
import {
  normalizeScale,
  normalizeSize,
  normalizeSizeFunc,
} from '../../component/core/PanZoom/utils';
import { artUrls } from '../testdata/mediaSamples';
import StoryHint from './StoryHint';

import { mediaSamplesWithLabel as mediaList } from '../testdata/mediaSamples';
import { withPlaydeck } from '../../component/core/MediaPlayer/composer';
import Timeline from '../../component/core/Timeline';
import { PlayDeck } from '../..';
import { RectSize } from '../../component/core/PanZoom/types';

const story = {
  title: 'PanZoom',
};

export const Default = (): JSX.Element => {
  const videoUrlKnob = select('Media URL', artUrls, artUrls[0]);
  const disabled = boolean('Disabled', false);

  return (
    <StoryHint
      hint={
        <div>
          <p>
            <b>Tablet</b>: pan and zoom using two fingers
          </p>
          <p>
            <b>Laptop</b>: zoom using mouse wheel or using two finger gesture on
            trackpad
          </p>
        </div>
      }
    >
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
    </StoryHint>
  );
};

export const WithAnnotationImage = (): JSX.Element => {
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
          return (
            <AnnotateCanvas
              elements={sampleAnnotations}
              width={containerSize.width}
              height={containerSize.height}
              panZoom={{
                ...panZoom,
                scale: normalizeScale(contentSize, panZoom.scale, resKnob),
              }}
              disabled={modeKnob !== 'Annotate'}
            />
          );
        }}
      />
    </PanZoom>
  );
};

export const WithAnnotationOembed = (): JSX.Element => {
  const [mediaIndex, setMediaIndex] = useState(0);
  const mediaKnob = select('Video', mediaList, mediaList[mediaIndex]);

  useEffect(() => {
    const index = mediaList.reduce((a, c, i) => {
      if (c.label === mediaKnob.label) a = i;
      return a;
    }, 0);
    setMediaIndex(index);
  }, [mediaKnob]);

  const modeKnob = select('Mode', ['PanZoom', 'Annotate'], 'PanZoom');

  return (
    <PanZoom disabled={modeKnob !== 'PanZoom'}>
      <PanZoomContent
        render={(setContentSize) => {
          useEffect(() => {
            setContentSize(mediaList[mediaIndex]);
          }, [mediaIndex]);
          return withPlaydeck(
            mediaList,
            mediaIndex,
            setMediaIndex,
            Timeline,
            PlayDeck,
          );
        }}
      />
      <PanZoomOverlay
        render={(panZoom, contentSize, containerSize, _inProgress) => {
          return (
            <AnnotateCanvas
              elements={sampleAnnotations}
              width={containerSize.width}
              height={containerSize.height}
              panZoom={{
                ...panZoom,
                scale: normalizeScale(contentSize, panZoom.scale, 1000),
              }}
              disabled={modeKnob !== 'Annotate'}
            />
          );
        }}
      />
    </PanZoom>
  );
};

Default.parameters = { layout: 'fullscreen' };
WithAnnotationImage.parameters = { layout: 'fullscreen' };
WithAnnotationOembed.parameters = { layout: 'fullscreen' };
export default story;
