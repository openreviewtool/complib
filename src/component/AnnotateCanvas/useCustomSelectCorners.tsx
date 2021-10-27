import React from 'react';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { fObjExtend } from './types';

const HAS_ROTATE_HANDLE = true;

function useCustomSelectCorners(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
): void {
  React.useEffect(() => {
    fabricCanvasRef.current.on('selection:created', handle_selection_created);
    fabricCanvasRef.current.on('selection:updated', handle_selection_created);
  }, []);

  const handle_selection_created = (event: IEvent) => {
    if (event.target) {
      const fObj = event.target as fObjExtend;
      setSelectionControls(event.target, fObj.etype);

      if (event.target.hasOwnProperty('_objects')) {
        const selection = fObj._objects;
        selection.forEach((s) => setSelectionControls(s, s.etype));
      }
    }
  };
}

/**
 * Set the selection handle for fabric shape and groups.
 * @param newElement new Fabric Object
 * @param elementType the fabric object type
 */
const setSelectionControls = (
  newElement: fabric.Object,
  elementType?: string,
): void => {
  newElement.cornerStyle = 'circle';
  newElement.cornerStrokeColor = 'white';
  newElement.cornerSize = 10;
  newElement.borderDashArray = [5, 5];

  if (!HAS_ROTATE_HANDLE) {
    newElement.setControlVisible('mtr', false);
  }

  if (elementType === 'Textbox') {
    newElement.setControlVisible('tl', false);
    newElement.setControlVisible('mt', false);
    newElement.setControlVisible('tr', false);
    newElement.setControlVisible('bl', false);
    newElement.setControlVisible('mb', false);
    newElement.setControlVisible('br', false);
  }
};

export default useCustomSelectCorners;
