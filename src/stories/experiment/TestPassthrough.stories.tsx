import React, { useEffect, useState } from 'react';

import { select, boolean, optionsKnob } from '@storybook/addon-knobs';
import PanZoom from '../../component/core/PanZoom';
import AnnotateCanvas from '../../component/core/AnnotateCanvas/AnnotateCanvas';
import { sampleAnnotations } from '../testdata/annotationSamples';
import {
  PanZoomContent,
  PanZoomOverlay,
} from '../../component/core/PanZoom/PanZoom';
import { normalizeScale } from '../../component/core/PanZoom/utils';
import { artUrls } from '../testdata/mediaSamples';
import { getAnnotateKnobs, StoryHint } from '../component/utils';

import { mediaSamplesWithLabel as mediaList } from '../testdata/mediaSamples';
import * as playerComposer from '../../component/core/MediaPlayer/playerComposer';
import { DEFAULT_UI_ATTRS } from '../../component/core/AnnotateCanvas/defaults';
import { UserControllerInputs } from '../../component/core/AnnotateCanvas/types';
import BrushTools from '../../component/core/AnnotateCanvas/UI/BrushTools';
import EditTools from '../../component/core/AnnotateCanvas/UI/EditTools';

const story = {
  title: 'Experiment',
};


export const Test2 = (): JSX.Element => {
  const [mediaIndex, setMediaIndex] = useState(0);
  const mediaKnob = select('Video', mediaList, mediaList[mediaIndex]);

  useEffect(() => {
    const index = mediaList.reduce((a, c, i) => {
      if (c.label === mediaKnob.label) a = i;
      return a;
    }, 0);
    setMediaIndex(index);
  }, [mediaKnob]);

  const [uiState, setUiState] =
    useState<UserControllerInputs>(DEFAULT_UI_ATTRS);

  return (
    <StoryHint hint={<div>for experiment only</div>}>
      <playerComposer.PlayerContextProvider
        value={{ mediaList, mediaIndex, setMediaIndex }}
      >
        <div>
          <PanZoom>
             {/* disabled={uiState.mode !== 'panZoom'}> */}
            <PanZoomContent
              render={(setContentSize) => {
                useEffect(() => {
                  setContentSize(mediaList[mediaIndex]);
                }, [mediaIndex]);
                return <playerComposer.Player />;
              }}
              normalizeRes={1000}
            />
            {uiState.showAnnotation && (
              <PanZoomOverlay
                render={(panZoom, contentSize, containerSize) => {
                  return (
                    <AnnotateCanvas
                      elements={sampleAnnotations}
                      width={containerSize.width}
                      height={containerSize.height}
                      panZoom={{
                        ...panZoom,
                        scale: normalizeScale(contentSize, panZoom.scale, 1000),
                      }}
                      uiState={uiState}
                      setUiState={setUiState}
                      disabled={uiState.mode === 'panZoom'}
                    />
                  );
                }}
              />
            )}
          </PanZoom>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <playerComposer.Timeline />
            <playerComposer.PlayDeck />
          </div>
          <BrushTools uiState={uiState} setUIState={setUiState} />
          <EditTools uiState={uiState} setUIState={setUiState} />
        </div>
      </playerComposer.PlayerContextProvider>
    </StoryHint>
  );
};

Test2.parameters = { layout: 'fullscreen' };
export default story;
