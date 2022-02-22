import React from 'react';
import { fabric } from 'fabric';
import { PanZoomSpec } from '../../PanZoom/types';
import { setHoverStyle } from '../utils';
import { UserSelectionConfig } from '../types';

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

    fabricCanvasRef.current.clearContext(
      (fabricCanvasRef.current as any).contextTop,
    );
  }, [panZoom]);
};
export default usePanZoom;
