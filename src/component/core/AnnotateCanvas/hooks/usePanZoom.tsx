import React from 'react';
import { fabric } from 'fabric';
import { PanZoomSpec } from '../PanZoom/types';


const usePanZoom = (
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  panZoom?: PanZoomSpec,
) => {
  React.useEffect(() => {
    if (panZoom) {
      fabricCanvasRef.current.setViewportTransform([
        panZoom.scale,
        0,
        0,
        panZoom.scale,
        panZoom.x,
        panZoom.y,
      ]);
    }
  }, [panZoom]);
}
export default usePanZoom;