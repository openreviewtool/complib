import React from 'react';
import { fabric } from 'fabric';
import { fObjExtend, UserControllerInputs } from './../types';

function useSyncSelection(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  uiState: UserControllerInputs,
  setUIState?: (u: UserControllerInputs) => void,
  onSelection?: (selected: string[]) => void,
): void {
  React.useEffect(() => {
    fabricCanvasRef.current.on('selection:created', (event: any) => {
      handle_selection_change(event.selected);
    });
    fabricCanvasRef.current.on('selection:updated', (event: any) => {
      handle_selection_change(event.selected, event.deselected);
    });
    fabricCanvasRef.current.on('selection:cleared', (event: any) => {
      handle_selection_change(event.selected, event.deselected);
    });
  }, []);

  const handle_selection_change = (
    added?: fabric.Object[],
    removed?: fabric.Object[],
  ) => {
    const activeObjs = fabricCanvasRef.current.getActiveObjects();
    const s = activeObjs.map((e) => (e as fObjExtend).id);

    const _added = added?.map((e) => (e as fObjExtend).id);
    const _removed = removed?.map((e) => (e as fObjExtend).id);

    if (activeObjs.length === 1 && setUIState) {
      const obj = activeObjs[0] as fObjExtend;
      if (['Rect', 'Ellipse', 'Path'].includes(obj.etype)) {
        const updatedUiState = {
          ...uiState,
          strokeWidth: obj.strokeWidth as number,
          color: obj.stroke
        };
        setTimeout(setUIState, 200, updatedUiState);
      }
      if (['Textbox'].includes(obj.etype)) {
        setTimeout(setUIState, 200, {
          ...uiState,
          color: obj.fill,

          // ToDo: temporary use stroke width to set font size, hack starts
          // strokeWidth: obj.fontSize,
          // fontSize: obj.fontSize,
          // hack ends
        });
      }
    }

    if (onSelection) {
      onSelection(s);
    }
  };
}

export default useSyncSelection;
