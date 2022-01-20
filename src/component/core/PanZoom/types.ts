export interface PanZoomSpec {
  x: number;
  y: number;
  scale: number;
}

export interface Coords {
  x: number;
  y: number;
}

export interface RectSize {
  width: number;
  height: number;
}

/**
 * Specifies the specs to center fit content to the container 
 * and the zoom bounds.
 */
export interface PanZoomBounds {
  fitSpec: PanZoomSpec;
  min: number,
  max: number,
}
