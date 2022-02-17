import React from 'react';
import { fabric } from 'fabric';
import { fObjExtend, fSelectionEvent, UserSelectionConfig } from './../types';
import { setSelectionControls } from './../utils';

function useCustomSelectCorners(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  selectionConfig?: UserSelectionConfig,
): void {
  React.useEffect(() => {
    fabricCanvasRef.current.on('selection:created', handle_selection);
    fabricCanvasRef.current.on('selection:updated', handle_selection);
    fabricCanvasRef.current.on('selection:cleared', handle_selection);
  }, []);

  // drag bound selection no longer create an event, hence can't query
  // selection that way, so hence use function getActiveObject.
  const handle_selection = () => {
    const activeObj = fabricCanvasRef.current.getActiveObject() as fObjExtend

    if (activeObj) {
      setSelectionControls(activeObj, activeObj.etype, selectionConfig);

      // multiselections
      if (activeObj._objects) {
        const selection = activeObj._objects;
        selection.forEach((s) =>
          setSelectionControls(s, s.etype, selectionConfig),
        );
      }
    }
  };
}

export default useCustomSelectCorners;
