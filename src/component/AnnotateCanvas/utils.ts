import { fabric } from 'fabric';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  AnnotateElement,
  AnnotateElementType,
  fabricObjAttrsLookup,
  UserControllerInputs,
} from './types';

export const makeElement = (
  etype: AnnotateElementType,
  fObj: fabric.Object,
): AnnotateElement => {
  const element = fabricObjAttrsLookup[etype].reduce((p, c) => {
    p[c] = (fObj as any)[c];
    return p;
  }, {} as Partial<AnnotateElement>);
  element.transformMatrix = fObj.calcTransformMatrix();
  return { etype, id: uuidv4(), ...element };
};

export const FabricObjectDefaults = {
  perPixelTargetFind: true,
  noScaleCache: false,
  strokeUniform: true,
};

/**
 * Deserialize the element
 * @param props
 * @returns
 */
export const makeFabricObj = async (
  props: Partial<AnnotateElement>,
): Promise<fabric.Object> => {
  let newFObj: fabric.Object;

  if (props.etype === 'Textbox') {
    newFObj = new fabric.Textbox('text', {
      text: 'Enter text...',
      fontFamily: 'Times New Roman',
      ...FabricObjectDefaults,
      ...props,
    });
  } else if (props.etype === 'Path') {
    newFObj = new fabric.Path(props.path as string, {
      strokeLineCap: 'round',
      ...FabricObjectDefaults,
      ...props,
    });
  } else if (props.etype === 'Rect') {
    newFObj = new fabric.Rect({
      ...FabricObjectDefaults,
      ...props,
    });
  } else if (props.etype === 'Circle') {
    newFObj = new fabric.Circle({
      ...FabricObjectDefaults,
      ...props,
    });
  } else if (props.etype === 'Ellipse') {
    newFObj = new fabric.Ellipse({
      ...FabricObjectDefaults,
      ...props,
    });
  } else {
    throw Error(
      `Failed to deserialize element of unsupported type "${props.etype}".`,
    );
  }

  if (props.transformMatrix) {
    // const t = fabric.util.qrDecompose((newFObj as fObjExtend).transformMatrix);
    const t = fabric.util.qrDecompose(props.transformMatrix as number[]);

    newFObj.set(t);
    newFObj.setPositionByOrigin(
      { x: t.translateX, y: t.translateY } as fabric.Point,
      'center',
      'center',
    );
  }
  newFObj.setCoords();

  return newFObj;
};

export const getElementPropsFromUiState = (
  uiState: UserControllerInputs,
): Partial<AnnotateElement> => {
  const { shape } = uiState;
  return {
    ...uiState,
    etype: shape,
    fill: (['Textbox', 'SVG'].indexOf(shape) !== -1
      ? uiState.color
      : '') as string,
    stroke: (['Textbox', 'SVG'].indexOf(shape) !== -1
      ? ''
      : uiState.color) as string,
    strokeWidth: (['Textbox'].indexOf(shape) !== -1
      ? 0
      : uiState.strokeWidth) as number,
  };
};

export const getUiStateFromElement = (
  element: AnnotateElement,
): Partial<UserControllerInputs> => {
  const uiState: Partial<UserControllerInputs> = { shape: element.etype };

  if (['Textbox'].indexOf(element.etype) !== -1) {
    uiState.color = element.fill as string;
    uiState.fontSize = element.fontSize as number;
    uiState.fontFamily = element.fontFamily as string;
  }

  if (
    ['Rect', 'Circle', 'Triangle', 'Ellipse', 'Path'].indexOf(element.etype) !=
    -1
  ) {
    uiState.strokeWidth = element.strokeWidth as number;
    uiState.color = element.stroke as string;
  }

  return uiState;
};

export const useCanvasDebugger = (
  elements: AnnotateElement[],
  selection: string[],
): void => {
  // this is loggig for debugging only
  React.useEffect(() => {
    // console.log('...Elements', elements);
    // console.log('...Selection', selection);
    const elementSelection = elements.filter(
      (e) => selection.indexOf(e.id) !== -1,
    );
    if (elementSelection.length) {
      console.log(
        'selected: ',
        getUiStateFromElement(elementSelection[0]),
      );
    }
  }, [elements, selection]);
};
