import React from 'react';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { fSelectionEvent, UserSelectionConfig } from './types';
import { bootstrapHoverHandler, setHoverStyle } from './utils';

function useCustomHoverStyle(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  selectionConfig?: UserSelectionConfig,
): void {
  React.useEffect(() => {
    fabricCanvasRef.current.on('object:added', handle_object_added);
    fabricCanvasRef.current.on('path:created', handle_object_added);
    fabricCanvasRef.current.on('selection:created', handle_selection);
    fabricCanvasRef.current.on('selection:updated', handle_selection);
    fabricCanvasRef.current.on('selection:cleared', handle_selection);
  }, []);

  const handle_object_added = (event: IEvent) => {
    if (event.target) {
      setHoverStyle(event.target, false, selectionConfig);
      bootstrapHoverHandler(event.target);
    }
  };

  const handle_selection = (event: fSelectionEvent) => {
    event.selected?.forEach((s) => {
      setHoverStyle(s, true, selectionConfig);
    });
  
    event.deselected?.forEach((s) => {
      setHoverStyle(s, false, selectionConfig);
    });
  };
}

export default useCustomHoverStyle;
