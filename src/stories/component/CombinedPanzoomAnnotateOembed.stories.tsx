import React, { useContext, useEffect, useState } from 'react';

import PanZoom from '../../component/core/PanZoom';

import {
  PanZoomContent,
  PanZoomOverlay,
} from '../../component/core/PanZoom/PanZoom';
import { mediaSamples2 } from '../testdata/mediaSamples';
import { sampleMediaAnnotateList } from '../testdata/annotationSamples';

import * as playerComposer from '../../component/core/MediaPlayer/playerComposer';
import * as annotateComposer from '../../component/core/AnnotateCanvas/annotateComposer';

import { DEFAULT_UI_ATTRS } from '../../component/core/AnnotateCanvas/defaults';
import {
  TimedSketch,
  UserControllerInputs,
} from '../../component/core/AnnotateCanvas/types';
import BrushTools from '../../component/core/AnnotateCanvas/UI/BrushTools';
import EditTools from '../../component/core/AnnotateCanvas/UI/EditTools';
import { StoryHint } from './utils';
import { boolean } from '@storybook/addon-knobs';

const story = {
  title: 'Combined',
};

const hintsAnnotateOembed = (
  <>
    <h4>Annotate oEmbed</h4>
    oEmbed allows webapps to embed media from YouTube, Vimeo, Sound Cloud, etc.
    You can annotate on these.
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

export const PanZoomAnnotateOembed = (): JSX.Element => {
  const nativeControls = false;

  const [mediaIndex, setMediaIndex] = useState(0);

  const [uiState, setUiState] =
    useState<UserControllerInputs>(DEFAULT_UI_ATTRS);

  const [annotationList, setAnnotationList] = useState<TimedSketch[][]>(
    sampleMediaAnnotateList,
  );

  return (
    <StoryHint hint={<div>{hintsAnnotateOembed}</div>}>
      <playerComposer.PlayerContextProvider
        value={{ mediaList: mediaSamples2, mediaIndex, setMediaIndex }}
      >
        <annotateComposer.AnnotateContext.Provider
          value={{
            mediaAnnotation: annotationList[mediaIndex],
            setMediaAnnotation: (s: TimedSketch[]) => {
              const newAnnotationList = [...annotationList];
              newAnnotationList[mediaIndex] = s;
              setAnnotationList(newAnnotationList);
            },
          }}
        >
          <div>
            <PanZoom disabled={uiState.mode !== 'panZoom'}>
              <PanZoomContent>
                <playerComposer.Player controls={nativeControls} />
              </PanZoomContent>
              <PanZoomOverlay pointerEventPassthrough={nativeControls}>
                <annotateComposer.AnnotateCanvas
                  uiState={uiState}
                  setUiState={setUiState}
                />
              </PanZoomOverlay>
            </PanZoom>
            {!nativeControls && <playerComposer.PlayDeckWithTimeline />}
            <BrushTools uiState={uiState} setUIState={setUiState} />
            <EditTools uiState={uiState} setUIState={setUiState} />
          </div>
        </annotateComposer.AnnotateContext.Provider>
      </playerComposer.PlayerContextProvider>
    </StoryHint>
  );
};

PanZoomAnnotateOembed.parameters = { layout: 'fullscreen' };
export default story;
