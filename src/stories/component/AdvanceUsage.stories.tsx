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
import { getAnnotateKnobs, StoryHint } from './utils';

import { mediaSamplesWithLabel as mediaList } from '../testdata/mediaSamples';
import * as playerComposer from '../../component/core/MediaPlayer/composer';
import { DEFAULT_UI_ATTRS } from '../../component/core/AnnotateCanvas/defaults';
import { UserControllerInputs } from '../../component/core/AnnotateCanvas/types';
import elementsActionReducer from '../../component/core/AnnotateCanvas/elementActionReducer';
import BrushTools from '../../component/core/AnnotateCanvas/UI/BrushTools';
import EditTools from '../../component/core/AnnotateCanvas/UI/EditTools';

const story = {
  title: 'All Together Now',
};

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

export const AnnotatePanZoomImage = (): JSX.Element => {
  const videoUrlKnob = select('Media URL', artUrls, artUrls[0]);
  const { resolutionKnob } = getAnnotateKnobs();

  const [uiState, setUiState] =
    useState<UserControllerInputs>(DEFAULT_UI_ATTRS);

  const [elementsState, elementsDispatcher] = React.useReducer(
    elementsActionReducer,
    sampleAnnotations,
  );

  return (
    <StoryHint hint={<div>{hintsAnnotateMedia}</div>}>
      <PanZoom disabled={uiState.mode !== 'panZoom'}>
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
        {uiState.showAnnotation && (
          <PanZoomOverlay
            pointerEventPassthrough={uiState.mode === 'panZoom'}
            render={(panZoom, contentSize, containerSize) => {
              return (
                <AnnotateCanvas
                  elements={elementsState}
                  width={containerSize.width}
                  height={containerSize.height}
                  panZoom={{
                    ...panZoom,
                    scale: normalizeScale(
                      contentSize,
                      panZoom.scale,
                      resolutionKnob,
                    ),
                  }}
                  uiState={uiState}
                  setUiState={setUiState}
                  onChangeElement={(elementUpdates) =>
                    elementsDispatcher({
                      type: 'changeElement',
                      elementUpdates,
                    })
                  }
                  onAddElement={(newElement) => {
                    elementsDispatcher({ type: 'addElement', newElement });
                  }}
                  disabled={uiState.mode === 'panZoom'}
                />
              );
            }}
          />
        )}
      </PanZoom>
      <BrushTools uiState={uiState} setUIState={setUiState} />
      <EditTools uiState={uiState} setUIState={setUiState} />
    </StoryHint>
  );
};

export const AnnotatePanZoomOembed = (): JSX.Element => {
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

  const [elementsState, elementsDispatcher] = React.useReducer(
    elementsActionReducer,
    sampleAnnotations,
  );

  return (
    <StoryHint hint={<div>{hintsAnnotateOembed}</div>}>
      <playerComposer.PlayerContextProvider
        value={{ mediaList, mediaIndex, setMediaIndex }}
      >
        <div>
          <PanZoom disabled={uiState.mode !== 'panZoom'}>
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
                      elements={elementsState}
                      width={containerSize.width}
                      height={containerSize.height}
                      panZoom={{
                        ...panZoom,
                        scale: normalizeScale(contentSize, panZoom.scale, 1000),
                      }}
                      uiState={uiState}
                      setUiState={setUiState}
                      onChangeElement={(elementUpdates) =>
                        elementsDispatcher({
                          type: 'changeElement',
                          elementUpdates,
                        })
                      }
                      onAddElement={(newElement) => {
                        elementsDispatcher({ type: 'addElement', newElement });
                      }}
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

AnnotatePanZoomImage.parameters = { layout: 'fullscreen' };
AnnotatePanZoomOembed.parameters = { layout: 'fullscreen' };
export default story;
