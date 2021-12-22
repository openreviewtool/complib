import React from 'react';
import { fabric } from 'fabric';

import {
  AnnotateElement,
  UserControllerInputs,
  UserSelectionConfig,
} from './types';
import { useCanvasDebugger } from './utils';
import useDrawShapeHandler from './useDrawShapeHandler';
import useCustomSelectCorners from './useCustomSelectCorners';
import useCustomHoverStyle from './useCustomHoverStyle';
import useModifyHandler from './useModifyHandler';
import useSyncSelection from './useSyncSelection';
import useApplyAttrsToSelection from './useApplyAttrsToSelection';
import FabricCanvas from './FabricCanvas';
import useRedrawElements from './useRedrawElements';
import { DEFAULT_SELECTION_CONFIG, DEFAULT_UI_ATTRS } from './defaults';

interface AnnotateCanvasProps {
  elements: AnnotateElement[];
  selection?: string[];
  
  width?: number;
  height?: number;
  backgroundColor?: string;
  
  // if true, redraw the entire canvas when ever one element updates
  clearOnElementModify?: boolean; 
  
  onAddElement?: (element: AnnotateElement) => void;
  onChangeElement?: (element: Partial<AnnotateElement>) => void;
  onSelection?: (
    selected: string[],
    added: string[],
    removed: string[],
    ) => void;
    
  uiState?: UserControllerInputs;
  selectionConfig?: UserSelectionConfig,

  debugLogging?: boolean,
}

const AnnotateCanvas: React.FC<AnnotateCanvasProps> = ({
  elements = [],
  selection = [],
  
  width = 100,
  height = 100,
  backgroundColor = '',
  
  clearOnElementModify = false,

  uiState = DEFAULT_UI_ATTRS,
  selectionConfig = DEFAULT_SELECTION_CONFIG,

  debugLogging = false,

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
  useCustomHoverStyle(fabricCanvasRef);
  useDrawShapeHandler(fabricCanvasRef, uiState, props.onAddElement);
  useModifyHandler(fabricCanvasRef, props.onChangeElement);
  useApplyAttrsToSelection(
    fabricCanvasRef,
    uiState,
    selection,
    elements,
    props.onChangeElement,
  );
  useCanvasDebugger(debugLogging, elements, selection, fabricCanvasRef);

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
