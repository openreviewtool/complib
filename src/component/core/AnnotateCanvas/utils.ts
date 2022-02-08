import { fabric } from 'fabric';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FabricObjectDefaults, HAS_ROTATE_HANDLE } from './defaults';

import {
  AnnotateElement,
  fabricObjAttrsLookup,
  fObjExtend,
  UserControllerInputs,
  UserSelectionConfig,
} from './types';

/**
 * Serialize the fabric object by extracting the attributes into a hash.
 * This happens when user draws a new element.
 * @param props
 * @returns
 */
export const makeElement = (
  // etype: AnnotateElementType,
  fObj: fObjExtend,
): AnnotateElement => {
  const element = fabricObjAttrsLookup[fObj.etype].reduce((p, c) => {
    p[c] = (fObj as any)[c];
    return p;
  }, {} as Partial<AnnotateElement>);
  return {
    etype: fObj.etype,
    id: fObj.id,
    transformMatrix: fObj.calcTransformMatrix(),
    fabricObj: fObj,
    ...element,
  };
};

/**
 * Make an extended fabric object, this is called when deserializing
 * the fabric object from data, or when creating a new shape from drawing event.
 * @param props
 * @returns
 */
export const makeFabricObj = async (
  props: Partial<AnnotateElement>,
): Promise<fObjExtend> => {
  let newFObj: fabric.Object;
  const fObjProps = { ...props };

  if (fObjProps.transformMatrix) {
    delete fObjProps.transformMatrix;
    // keep the id and the etype
  }
  if (!fObjProps.etype || !fObjProps.id) {
    throw 'Can not make extended fabric object without etype and id.';
  }

  if (props.etype === 'Textbox') {
    newFObj = new fabric.Textbox('text', {
      text: 'Enter text...',
      fontFamily: 'Times New Roman',
      ...FabricObjectDefaults,
      ...fObjProps,
    });
  } else if (props.etype === 'Path') {
    newFObj = new fabric.Path(props.path as string, {
      strokeLineCap: 'round',
      ...FabricObjectDefaults,
      ...fObjProps,
    });
  } else if (props.etype === 'Rect') {
    newFObj = new fabric.Rect({
      ...FabricObjectDefaults,
      ...fObjProps,
    });
  } else if (props.etype === 'Circle') {
    newFObj = new fabric.Circle({
      ...FabricObjectDefaults,
      ...fObjProps,
    });
  } else if (props.etype === 'Ellipse') {
    newFObj = new fabric.Ellipse({
      ...FabricObjectDefaults,
      ...fObjProps,
    });
  } else {
    throw Error(
      `Failed to deserialize element of unsupported type "${props.etype}".`,
    );
  }

  // set the object position based on the transform matrix.
  if (props.transformMatrix) {
    const t = fabric.util.qrDecompose(props.transformMatrix as number[]);

    newFObj.set(t);
    newFObj.setPositionByOrigin(
      { x: t.translateX, y: t.translateY } as fabric.Point,
      'center',
      'center',
    );
  }
  newFObj.setCoords();

  return newFObj as fObjExtend;
};

export const getElementPropsFromUiState = (
  uiState: UserControllerInputs,
): Partial<AnnotateElement> => {
  const { shape } = uiState;
  return {
    // ...uiState,
    // mode: CanvasMode;
    // showAnnotation: boolean;
    // shape: uiState.shape,
    fontSize: uiState.fontSize,
    color: uiState.color,
    fontFamily: uiState.fontFamily,
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
  on: boolean,
  elements: AnnotateElement[],
  selection: string[],
  fCanvasRef: React.MutableRefObject<fabric.Canvas>,
): void => {
  // this is loggig for debugging only
  React.useEffect(() => {
    if (!on || !fCanvasRef?.current) return;

    console.log('All elements: ', elements);
    if (fCanvasRef?.current) {
      console.log('All Fabric Objects: ', fCanvasRef.current.getObjects());
    }
    console.log('Selection Ids: ', selection);
    const elementSelection = elements.filter(
      (e) => selection.indexOf(e.id) !== -1,
    );
    if (elementSelection.length) {
      console.log('Selected: ', getUiStateFromElement(elementSelection[0]));
    }
  }, [elements, selection]);
};

export const setHoverStyle = (
  newElement: fabric.Object,
  selected: boolean,
  config?: UserSelectionConfig,
) => {
  newElement.cornerStyle = 'circle';
  newElement.transparentCorners = false;
  newElement.cornerSize = 12;
  newElement.borderDashArray = selected ? undefined : [5, 5];
  newElement.borderColor = config?.selectionColor;
  newElement.cornerColor = config?.selectionColor;
};

/**
 * Set the selection handle for fabric shape and groups.
 * @param newElement new Fabric Object
 * @param elementType the fabric object type
 */
export const setSelectionControls = (
  newElement: fabric.Object,
  elementType?: string,
  config?: UserSelectionConfig,
): void => {
  newElement.cornerStyle = 'circle';
  newElement.transparentCorners = false;
  newElement.cornerSize = 12;
  newElement.borderDashArray = undefined;
  newElement.borderColor = config?.selectionColor;
  newElement.cornerColor = config?.selectionColor;

  if (!HAS_ROTATE_HANDLE) {
    newElement.setControlVisible('mtr', false);
  }

  if (elementType === 'Textbox') {
    newElement.setControlVisible('tl', false);
    newElement.setControlVisible('mt', false);
    newElement.setControlVisible('tr', false);
    newElement.setControlVisible('bl', false);
    newElement.setControlVisible('mb', false);
    newElement.setControlVisible('br', false);
  }
};

export const bootstrapHoverHandler = (newFObj: fabric.Object) => {
  // set hover properties
  newFObj.on('mouseover', function (this: any) {
    this._renderControls(this.canvas.contextTop, {
      hasControls: false,
    });
  });
  newFObj.on('mousedown', function (this: any) {
    this.canvas.clearContext(this.canvas.contextTop);
  });
  newFObj.on('mouseout', function (this: any) {
    this.canvas.clearContext(this.canvas.contextTop);
  });
};
