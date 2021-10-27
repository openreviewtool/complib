import React, { useState } from 'react';
import { optionsKnob, number, color } from '@storybook/addon-knobs';
import AnnotateCanvas from '../../component/AnnotateCanvas';

import { UserControllerInputs } from '../../component/AnnotateCanvas/types';
import elementsActionReducer from '../../component/AnnotateCanvas/elementActionReducer';
import { makeElement } from '../../component/AnnotateCanvas/utils';

import { sampleAnnotations2 } from '../testdata/annotationSamples';

const story = {
  title: 'Components/AnnotateCanvas',
};

export const Default = (): JSX.Element => {
  const shapeKnob = optionsKnob(
    'Shape',
    {
      Ellipse: 'Ellipse',
      Rect: 'Rect',
      SVG: 'SVG',
      Textbox: 'Textbox',
      Path: 'Path',
    },
    'Rect',
    { display: 'inline-radio' },
  );
  const canvasModeKnob = optionsKnob(
    'Canvas Mode',
    { draw: 'draw', selection: 'selection', panZoom: 'panZoom' },
    'draw',
    { display: 'inline-radio' },
  );
  const fontSizeKnob = number('Attr/Font Size', 12, {
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

  const [selection, setSelection] = useState<string[]>([]);
  const [elementsState, elementsDispatcher] = React.useReducer(
    elementsActionReducer,
    sampleAnnotations2,
  );

  const uiState: UserControllerInputs = {
    mode: canvasModeKnob,
    shape: shapeKnob,
    fontSize: fontSizeKnob,
    color: colorKnob,
    strokeWidth: strokeWidthKnob,
    fontFamily: 'Times New Roman',
  };
  // const handleDeleteShape = () => {
  //   elementsDispatcher({ type: 'removeElement', removeIds: selection });
  // };

  return (
    <div>
      <AnnotateCanvas
        elements={elementsState}
        selection={selection}
        uiState={uiState}
        width={800}
        height={600}
        backgroundColor={'darkgreen'}
        // onChangeElement={(elementUpdate) => {
        //   const id = elementUpdate.id;
        //   console.log('...on changed elment', elementUpdate);

        // setElements((prevElements) => {
        //   return prevElements.map((element) => {
        //     if (element.id === id) {
        //       return {
        //         ...element,
        //         ...elementUpdate,
        //         [element.etype === 'Textbox' ? 'fill' : 'stroke']: `rgb(${Math.floor(
        //           Math.random() * 128 + 128,
        //         )},${Math.floor(Math.random() * 128 + 128)},${Math.floor(Math.random() * 255)})`,
        //       };
        //     } else {
        //       return element;
        //     }
        //   });
        // });
        // }}
        // canvasMode={canvasModeKnob as CanvasMode}
        onChangeElement={(elementUpdates) =>
          elementsDispatcher({ type: 'changeElement', elementUpdates })
        }
        onAddElement={(etype, newThing) => {
          // console.log('....new element added', etype, newThing, newThing instanceof fabric.Object);
          // // setSelection([newElement.id]);
          const newElement = makeElement(etype, newThing);
          elementsDispatcher({ type: 'addElement', newElement });
        }}
        onSelection={(selection) => {
          console.log('...on selection', selection);
          setSelection(selection);
        }}
      />
    </div>
  );
};

export default story;
