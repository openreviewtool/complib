import { Coords, PanZoomSpec, RectSize } from './types';

/**
 * Returns the pan zoom specs for center fit content
 * @param content the dimensions of the content
 * @param container the dimensions of the container
 */
export const getContentFitSpec = (
  content: RectSize,
  container: RectSize,
): PanZoomSpec => {
  const viewerAspect = container.width / container.height;
  const contentAspect = content.width / content.height;
  const ratioWidth = container.width / content.width;
  const ratioHeight = container.height / content.height;

  const ratio = viewerAspect > contentAspect ? ratioHeight : ratioWidth;
  const scale = ratio;

  const x = Math.abs(container.width - content.width * scale) / 2;
  const y = Math.abs(container.height - content.height * scale) / 2;

  return { x, y, scale };
};
/**
 * Coordinates from touches, mouse clicks are relative to the screen,
 * this updates them to be relative to the target element.
 */
export const getAbsoluteCoords = (
  coords: { clientX: number; clientY: number },
  boundingRect: { left: number; top: number },
): Coords => {
  return {
    x: coords.clientX - boundingRect.left,
    y: coords.clientY - boundingRect.top,
  };
};

export const getDistance = (points: Coords[]): number => {
  if (points.length >= 2) {
    return Math.sqrt(
      Math.pow(points[0].x - points[1].x, 2) +
        Math.pow(points[0].y - points[1].y, 2),
    );
  }
  return 0;
};

export const getMidPoint = (points: Coords[]): Coords => {
  if (points.length === 2) {
    return {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    };
  }
  return points[0];
};

/**
 * Coordinates from touches are relative to the screen,
 * this updates them to be relative to the target element.
 */
export const getTouchCoords = (evt: React.TouchEvent): Coords[] => {
  return Array.from(evt.touches).map((t) =>
    getAbsoluteCoords(t, evt.currentTarget.getBoundingClientRect()),
  );
};

/**
 * Return the updated pan zoom spec {x, y, scale} from user touch
 * Assumes it's two finger touches
 * @param oriPanZoom the pan zoom state at the beginning of touch
 * @param touchesStart the finger position at touch start
 * @param touchesNow where the fingers are now
 * @returns
 */
export const getTouchMoveSpec = (
  oriPanZoom: PanZoomSpec,
  touchesStart: Coords[],
  touchesNow: Coords[],
): PanZoomSpec => {
  const startMid = getMidPoint([touchesStart[0], touchesStart[1]]);
  const nowMid = getMidPoint(touchesNow);

  const distancePrev = getDistance([touchesStart[0], touchesStart[1]]);
  const distanceNow = getDistance(touchesNow);
  const scale = distanceNow / distancePrev;

  const startShift = [startMid.x - oriPanZoom.x, startMid.y - oriPanZoom.y];

  const nowShift = [startShift[0] * scale, startShift[1] * scale];
  const deltaX = nowMid.x - startMid.x + startShift[0] - nowShift[0];
  const deltaY = nowMid.y - startMid.y + startShift[1] - nowShift[1];

  return {
    x: deltaX + oriPanZoom.x,
    y: deltaY + oriPanZoom.y,
    scale: oriPanZoom.scale * scale,
  };
};

/**
 * Normalize the resolution of annotate canvas for the content so that
 * the canvas resolution stays same regardless of the content resolution.
 * @param contentSize content width and height in pixel
 * @param scale the content pixel to screen pixel scale
 * @param resolution the desired annotate canvas resolution
 * @returns the normalized scale
 */
export const normalizeScale = (
  contentSize: RectSize,
  scale: number,
  resolution: number,
): number => {
  return (
    Math.max(contentSize.width / resolution, contentSize.height / resolution) *
    scale
  );
};

export const normalizeSize = (
  contentSize: RectSize,
  resolution: number,
): RectSize => {
  const widthRatio = contentSize.width / resolution;
  const heightRatio = contentSize.height / resolution;

  if (widthRatio > heightRatio) {
    return {
      width: resolution,
      height: (contentSize.height / contentSize.width) * resolution,
    };
  } else {
    return {
      height: resolution,
      width: (contentSize.width / contentSize.height) * resolution,
    };
  }
};

type normalizeSizeFuncReturnType = (c: RectSize) => RectSize;
export const normalizeSizeFunc = (
  resolution: number,
): normalizeSizeFuncReturnType => {
  return (contentSize: RectSize) => {
    return normalizeSize(contentSize, resolution);
  };
};
