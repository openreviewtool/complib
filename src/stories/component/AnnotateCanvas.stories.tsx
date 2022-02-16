import React, { useState } from 'react';
import { optionsKnob, number, color } from '@storybook/addon-knobs';
import AnnotateCanvas from '../../component/core/AnnotateCanvas';

import { UserControllerInputs } from '../../component/core/AnnotateCanvas/types';
import elementsActionReducer from '../../component/core/AnnotateCanvas/elementActionReducer';

import { sampleAnnotations } from '../testdata/annotationSamples';
import BrushTools from '../../component/core/AnnotateCanvas/UI/BrushTools';
import EditTools from '../../component/core/AnnotateCanvas/UI/EditTools';
import { DEFAULT_UI_ATTRS } from '../../component/core/AnnotateCanvas/defaults';

const story = {
  title: 'Components/AnnotateCanvas',
};

export const Default = (): JSX.Element => {
  return (
    <div>
      <AnnotateCanvas
        elements={sampleAnnotations}
        width={640}
        height={640}
        backgroundColor={'SlateGray'}
      />
    </div>
  );
};

export const Edit = (): JSX.Element => {
  const shapeKnob = optionsKnob(
    'Shape',
    {
      Ellipse: 'Ellipse',
      Rect: 'Rect',
      Textbox: 'Textbox',
      Path: 'Path',
    },
    'Rect',
    { display: 'inline-radio' },
  );
  const canvasModeKnob = optionsKnob(
    'Canvas Mode',
    { draw: 'draw', selection: 'selection' },
    'draw',
    { display: 'inline-radio' },
  );
  const fontSizeKnob = number('Attr/Font Size', 24, {
    range: true,
    min: 6,
    max: 50,
    step: 1,
  });
  const colorKnob = color('Stroke', '#11ff33');
  const strokeWidthKnob = number('Stroke Width', 3, {
    range: true,
    min: 1,
    max: 10,
    step: 1,
  });

  const [elementsState, elementsDispatcher] = React.useReducer(
    elementsActionReducer,
    sampleAnnotations,
  );

  const uiState: UserControllerInputs = {
    mode: canvasModeKnob,
    showAnnotation: true,
    shape: shapeKnob,
    fontSize: fontSizeKnob,
    color: colorKnob,
    strokeWidth: strokeWidthKnob,
    fontFamily: 'Times New Roman',
  };

  return (
    <div>
      <AnnotateCanvas
        elements={elementsState}
        uiState={uiState}
        width={640}
        height={640}
        backgroundColor={'SlateGray'}
        onChangeElement={(elementUpdates) =>
          elementsDispatcher({ type: 'changeElement', elementUpdates })
        }
        onAddElement={(newElement) => {
          elementsDispatcher({ type: 'addElement', newElement });
        }}
      />
    </div>
  );
};

export const WithBrushControls = (): JSX.Element => {
  const [uiState, setUiState] =
    useState<UserControllerInputs>(DEFAULT_UI_ATTRS);

  const [elementsState, elementsDispatcher] = React.useReducer(
    elementsActionReducer,
    sampleAnnotations,
  );

  return (
    <div id="top_panel" style={{ display: 'flex' }}>
      {uiState.showAnnotation && (
        <AnnotateCanvas
          elements={elementsState}
          width={640}
          height={640}
          backgroundColor={'SlateGray'}
          uiState={uiState}
          setUiState={setUiState}
          onChangeElement={(elementUpdates) =>
            elementsDispatcher({ type: 'changeElement', elementUpdates })
          }
          onAddElement={(newElement) => {
            elementsDispatcher({ type: 'addElement', newElement });
          }}
        />
      )}

      <BrushTools uiState={uiState} setUIState={setUiState} />
      <EditTools uiState={uiState} setUIState={setUiState} />
    </div>
  );
};

WithBrushControls.parameters = { layout: 'fullscreen' };
export default story;
