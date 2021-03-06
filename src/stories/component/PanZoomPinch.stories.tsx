import React from 'react';

import { select, boolean } from '@storybook/addon-knobs';
import PanZoom from '../../component/core/PanZoom';
import { PanZoomContent } from '../../component/core/PanZoom/PanZoom';
import { artUrls } from '../testdata/mediaSamples';
import { StoryHint } from './utils';

const story = {
  title: 'Components/PanZoom',
};

const hintsDefault = (
  <>
    <h3>PanZoom</h3>
    <p>
      <b>Tablet</b>: pan and zoom using two fingers
    </p>
    <p>
      <b>Laptop</b>: zoom using mouse wheel or using two finger gesture on
      trackpad
    </p>
  </>
);

const hintsAnnotateMedia = (
  <>
    <h4>Annotation</h4>
    <p>
      Annotate on the media of your choice; switch the content using the media
      selector.
    </p>
    <p>
      <b>PanZoom</b>: panning and zooming the content
    </p>
    <p>
      <b>Selection</b>: select the annotation
    </p>
    <p>
      <b>Annotate</b>: annotate on the content
    </p>
  </>
);

const hintsAnnotateOembed = (
  <>
    <h4>Annotate oEmbed</h4>
    oEmbed allows webapps to embed media from YouTube, Vimeo, Sound Cloud, etc.
    You can annotate on these. WIP: per frame annotation.
    <p>
      <b>PanZoom</b>: panning and zooming the content
    </p>
    <p>
      <b>Selection</b>: select the annotation
    </p>
    <p>
      <b>Annotate</b>: annotate on the content
    </p>
  </>
);

export const Default = (): JSX.Element => {
  const videoUrlKnob = select('Media URL', artUrls, artUrls[0]);
  const disabled = boolean('Disabled', false);

  return (
    <StoryHint hint={<div>{hintsDefault}</div>}>
      <PanZoom disabled={disabled}>
        <PanZoomContent
          render={(setContentSize) => (
            <img
              style={{ pointerEvents: 'none', userSelect: 'none' }}
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

Default.parameters = { layout: 'fullscreen' };
export default story;
