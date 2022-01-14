import { Coords, PanZoomSpec, RectSize } from "./types";

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

export const getDistance = (points: Coords[]) => {
  return Math.sqrt(
    Math.pow(points[0].x - points[1].x, 2) +
      Math.pow(points[0].y - points[1].y, 2),
  );
};

export const getMidPoint = (points: Coords[]) => {
  return [(points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2];
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

  const startShift = [startMid[0] - oriPanZoom.x, startMid[1] - oriPanZoom.y];

  const nowShift = [startShift[0] * scale, startShift[1] * scale];
  const deltaX = nowMid[0] - startMid[0] + startShift[0] - nowShift[0];
  const deltaY = nowMid[1] - startMid[1] + startShift[1] - nowShift[1];

  return {
    x: deltaX + oriPanZoom.x,
    y: deltaY + oriPanZoom.y,
    scale: oriPanZoom.scale * scale,
  };
};
