import React, { useState } from 'react';

import PanZoom from '../../component/core/PanZoom';

import {
  PanZoomContent,
  PanZoomOverlay,
} from '../../component/core/PanZoom/PanZoom';
import { mediaSamples2 } from '../testdata/mediaSamples';
import { sampleMediaAnnotateList } from '../testdata/annotationSamples';

import * as playerComposer from '../../component/composer/playerComposer';
import * as annotateComposer from '../../component/composer/annotateComposer';

import { DEFAULT_UI_ATTRS } from '../../component/core/AnnotateCanvas/defaults';
import {
  TimedSketch,
  UserControllerInputs,
} from '../../component/core/AnnotateCanvas/types';
import { StoryHint } from './utils';
import { PlayerContextProvider } from '../../component/core/MediaPlayer/PlayerContext';
import { MediaAnnotationContextProvider } from '../../component/core/AnnotateCanvas/MediaAnnotateContext';
import { button } from '@storybook/addon-knobs';

const story = {
  title: 'All Together Now',
};

const hintsAnnotateOembed = (
  <>
    <h4>Annotate oEmbed</h4>
    oEmbed allows webapps to embed media from YouTube, Vimeo, Sound Cloud, etc.
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
  button('Log Annotation to Console', () => {
    console.log('Annotation state: ', annotationList[mediaIndex]);
  });

  const [uiState, setUiState] =
    useState<UserControllerInputs>(DEFAULT_UI_ATTRS);

  const [annotationList, setAnnotationList] = useState<TimedSketch[][]>(
    sampleMediaAnnotateList,
  );

  return (
    <StoryHint hint={<div>{hintsAnnotateOembed}</div>}>
      <PlayerContextProvider
        value={{ mediaList: mediaSamples2, mediaIndex, setMediaIndex }}
      >
        <MediaAnnotationContextProvider
          mediaAnnotation={annotationList[mediaIndex]}
          setMediaAnnotation={(s: TimedSketch[]) => {
            const newAnnotationList = [...annotationList];
            newAnnotationList[mediaIndex] = s;
            setAnnotationList(newAnnotationList);
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
            <annotateComposer.AnnotateTools
              uiState={uiState}
              setUiState={setUiState}
            />
          </div>
        </MediaAnnotationContextProvider>
      </PlayerContextProvider>
    </StoryHint>
  );
};

PanZoomAnnotateOembed.parameters = { layout: 'fullscreen' };
export default story;
