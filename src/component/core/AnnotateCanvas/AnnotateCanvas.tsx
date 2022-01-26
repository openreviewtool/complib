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
import usePanZoom from './usePanZoom';

interface AnnotateCanvasProps {
  elements: AnnotateElement[];
  selection?: string[];

  width?: number;
  height?: number;
  backgroundColor?: string;
  panZoom?: { x: number; y: number; scale: number };

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
  selectionConfig?: UserSelectionConfig;

  disabled?: boolean;

  debugLogging?: boolean;
}

// this is use for initalization purpose.
// this is dangerous to be used within a component as creates an expensive
// canvas dom, and if not manage property, re-renders can quickly exhause memory.
// Hence have it outside makes more sense.
const EmptyCanvas = new fabric.Canvas('');

const AnnotateCanvas: React.FC<AnnotateCanvasProps> = React.memo(
  ({
    elements = [],
    selection = [],

    width = 100,
    height = 100,
    backgroundColor = '',

    clearOnElementModify = false,

    uiState = DEFAULT_UI_ATTRS,
    selectionConfig = DEFAULT_SELECTION_CONFIG,

    debugLogging = false,

    disabled = false,

    ...props
  }) => {
    const fcRef = React.useRef<fabric.Canvas>(EmptyCanvas);

    useRedrawElements(fcRef, backgroundColor, elements, clearOnElementModify);
    useSyncSelection(fcRef, props.onSelection);
    useCustomSelectCorners(fcRef, selectionConfig);
    useCustomHoverStyle(fcRef, selectionConfig);
    useDrawShapeHandler(fcRef, uiState, props.onAddElement, disabled);
    useModifyHandler(fcRef, props.onChangeElement);
    usePanZoom(fcRef, props.panZoom);
    useApplyAttrsToSelection(
      fcRef,
      uiState,
      selection,
      elements,
      props.onChangeElement,
    );
    useCanvasDebugger(debugLogging, elements, selection, fcRef);

    return (
      <div style={{ pointerEvents: disabled ? 'none' : undefined }}>
        <FabricCanvas
          fabricCanvasRef={fcRef}
          width={width}
          height={height}
          backgroundColor={backgroundColor}
        />
      </div>
    );
  },
);

export default AnnotateCanvas;
