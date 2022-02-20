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

    // sync the selected object state to the Ui controls
    // Note: the timeout is neccessary because if an object is preselected
    // then an new object gets selected, the new object sync the ui, and the ui
    // properties are applied to the pre-selection before selection is cleared.
    if (activeObjs.length === 1 && setUIState) {
      const obj = activeObjs[0] as fObjExtend;
      if (['Rect', 'Ellipse', 'Circle', 'Path'].includes(obj.etype)) {
        const updatedUiState = {
          ...uiState,
          strokeWidth: obj.strokeWidth as number,
          color: obj.stroke!,
          shape: obj.etype,
        };
        // The timeout
        setTimeout(setUIState, 200, updatedUiState);
      }
      if (['Textbox'].includes(obj.etype)) {
        setTimeout(setUIState, 200, {
          ...uiState,
          color: obj.fill,
          fontSize: obj.fontSize,
          shape: 'Textbox',
        });
      }
    }

    if (onSelection) {
      onSelection(s);
    }
  };
}

export default useSyncSelection;
