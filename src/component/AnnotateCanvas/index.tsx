import React from 'react';
import { fabric } from 'fabric';

import {
  AnnotateElementType,
  AnnotateElement,
  UserControllerInputs,
  uiDefaults,
} from './types';
import { useCanvasDebugger } from './utils';
import useDrawShapeHandler from './useDrawShapeHandler';
import useCustomSelectCorners from './useCustomSelectCorners';
import useModifyHandler from './useModifyHandler';
import useSyncSelection from './useSyncSelection';
import useApplyAttrsToSelection from './useApplyAttrsToSelection';
import FabricCanvas from './FabricCanvas';
import useRedrawElements from './useRedrawElements';

interface AnnotateCanvasProps {
  elements: AnnotateElement[];
  selection?: string[];
  uiState?: UserControllerInputs;

  width?: number;
  height?: number;
  backgroundColor?: string;

  // if true, redraw the entire canvas when ever one element updates
  clearOnElementModify?: boolean; 

  onAddElement?: (etype: AnnotateElementType, element: fabric.Object) => void;
  onChangeElement?: (element: Partial<AnnotateElement>) => void;
  onSelection?: (
    selected: string[],
    added: string[],
    removed: string[],
  ) => void;
}

const AnnotateCanvas: React.FC<AnnotateCanvasProps> = ({
  elements = [],
  selection = [],
  
  width = 100,
  height = 100,
  backgroundColor = '',
  
  clearOnElementModify = true,

  uiState = uiDefaults,

  ...props
}) => {
  const fabricCanvasRef = React.useRef<fabric.Canvas>(new fabric.Canvas(''));

  useRedrawElements(
    fabricCanvasRef,
    backgroundColor,
    elements,
    clearOnElementModify,
  );
  useSyncSelection(fabricCanvasRef, props.onSelection);
  useCustomSelectCorners(fabricCanvasRef);
  useDrawShapeHandler(fabricCanvasRef, uiState, props.onAddElement);
  useModifyHandler(fabricCanvasRef, props.onChangeElement);
  useApplyAttrsToSelection(
    fabricCanvasRef,
    uiState,
    selection,
    elements,
    props.onChangeElement,
  );
  useCanvasDebugger(elements, selection);

  return (
    <FabricCanvas
      fabricCanvasRef={fabricCanvasRef}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    />
  );
};

export default AnnotateCanvas;
