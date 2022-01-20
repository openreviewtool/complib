import React from 'react';
import { fabric } from 'fabric';
import { fObjExtend, fSelectionEvent, UserSelectionConfig } from './types';
import { setSelectionControls } from './utils';

function useCustomSelectCorners(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  selectionConfig?: UserSelectionConfig,
): void {
  React.useEffect(() => {
    fabricCanvasRef.current.on('selection:created', handle_selection);
    fabricCanvasRef.current.on('selection:updated', handle_selection);
    fabricCanvasRef.current.on('selection:cleared', handle_selection);
  }, []);

  const handle_selection = (event: fSelectionEvent) => {
    if (event.target) {
      const fObj = event.target as fObjExtend;
      setSelectionControls(event.target, fObj.etype, selectionConfig);

      // multiselections
      if (fObj._objects) {
        const selection = fObj._objects;
        selection.forEach((s) => setSelectionControls(s, s.etype));
      }
    }
  };
}

export default useCustomSelectCorners;
