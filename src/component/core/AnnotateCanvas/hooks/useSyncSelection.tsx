import React from 'react';
import { fabric } from 'fabric';
import { fObjExtend } from './types';

function useSyncSelection(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  onSelection?: (
    selected: string[],
    added: string[],
    removed: string[],
  ) => void,
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
    const s = fabricCanvasRef.current
      .getActiveObjects()
      .map((e) => (e as fObjExtend).id);
    const a = added?.map((e) => (e as fObjExtend).id);
    const r = removed?.map((e) => (e as fObjExtend).id);

    if (onSelection) {
      onSelection(s, a || [], r || []);
    }
  };
}

export default useSyncSelection;
