import React, { useState } from 'react';
import { fabric } from 'fabric';

import {
  AnnotateElement,
  fObjExtend,
  UserControllerInputs,
  UserSelectionConfig,
} from './types';
import { useCanvasDebugger } from './utils';
import useCustomSelectCorners from './hooks/useCustomSelectCorners';
import useCustomHoverStyle from './hooks/useCustomHoverStyle';
import useModifyHandler from './hooks/useModifyHandler';
import useSyncSelection from './hooks/useSyncSelection';
import useApplyAttrsToSelection from './hooks/useApplyAttrsToSelection';
import FabricCanvas from './FabricCanvas';
import { DEFAULT_SELECTION_CONFIG, DEFAULT_UI_ATTRS } from './defaults';
import usePanZoom from './hooks/usePanZoom';
import useRedrawElements from './hooks/useRedrawElements';
import useDrawShapeHandler from './hooks/useDrawShapeHandler';

interface AnnotateCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  panZoom?: { x: number; y: number; scale: number };

  // if true, redraw the entire canvas when ever one element updates
  clearOnElementModify?: boolean;

  elements: AnnotateElement[];
  onAddElement?: (element: AnnotateElement) => void;
  onChangeElement?: (elementUpdates: Partial<AnnotateElement>[]) => void;

  selection?: string[];
  onSelection?: (selected: string[]) => void;

  uiState?: UserControllerInputs;
  setUiState?: (u: UserControllerInputs) => void;
  selectionConfig?: UserSelectionConfig;

  disabled?: boolean;

  debugLogging?: boolean;
}

export const AnnotateUiContext = React.createContext({
  uiState: {},
});

// this is use for initalization purpose.
// this is dangerous to be used within a component as creates an expensive
// canvas dom, and if not manage property, re-renders can quickly exhause memory.
// Hence have it outside makes more sense.
const EmptyCanvas = new fabric.Canvas('');

const AnnotateCanvas: React.FC<AnnotateCanvasProps> = React.memo(
  ({
    elements = [],
    selection = undefined,
    onSelection = undefined,

    width = 100,
    height = 100,
    backgroundColor = '',

    clearOnElementModify = false,

    uiState = DEFAULT_UI_ATTRS,
    setUiState,
    selectionConfig = DEFAULT_SELECTION_CONFIG,

    debugLogging = false,

    disabled = false,

    ...props
  }) => {
    const fcRef = React.useRef<fabric.Canvas>(EmptyCanvas);
    const fObjRegistryRef = React.useRef<{ [elmId: string]: fObjExtend }>({});

    const [innerSelection, setInnerSelection] = useState<string[]>([]);
    if (!selection) selection = innerSelection;
    if (!onSelection) onSelection = setInnerSelection;

    useRedrawElements(
      fcRef,
      fObjRegistryRef,
      selection,
      backgroundColor,
      elements,
      clearOnElementModify,
    );
    useSyncSelection(fcRef, uiState, setUiState, onSelection);
    useCustomSelectCorners(fcRef, selectionConfig);
    useCustomHoverStyle(fcRef, selectionConfig);
    useDrawShapeHandler(
      fcRef,
      fObjRegistryRef,
      uiState,
      props.onAddElement,
      disabled,
    );
    useModifyHandler(fcRef, props.onChangeElement);
    usePanZoom(fcRef, props.panZoom);
    useApplyAttrsToSelection(
      fcRef,
      fObjRegistryRef,
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
