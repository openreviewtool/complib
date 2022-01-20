import React, { useEffect, useRef, useState } from 'react';
import { Coords, PanZoomBounds, PanZoomSpec, RectSize } from './types';
import {
  getAbsoluteCoords,
  getDistance,
  getMidPoint,
  getTouchCoords,
} from './utils';

/**
 * PinchZoomPan gesture on a web page manipuate the entire website,
 * This prevents that for the reference element.
 * @param ref html dom element where default guesture will be disabled.
 */
export const usePreventDefaultBrowserTouch = (
  ref: React.RefObject<HTMLElement>,
) => {
  useEffect(() => {
    ref.current?.addEventListener(
      'touchstart',
      (evt: TouchEvent) => {
        evt.preventDefault();
      },
      false,
    );
  }, []);
};

/**
 * Trackpad/mouse wheel gesture on a web page manipuate the entire website,
 * This prevents that for the reference element.
 * @param ref html dom element where default guesture will be disabled.
 */
export const usePreventDefaultBrowserWheel = (
  ref: React.RefObject<HTMLElement>,
) => {
  useEffect(() => {
    ref.current?.addEventListener(
      'wheel',
      (evt: TouchEvent) => {
        evt.preventDefault();
      },
      false,
    );
  }, []);
};

/**
 * Prevent dragging on a web dom element
 * @param ref html dom element where default guesture will be disabled.
 */
export const usePreventDefaultBrowserPointer = (
  ref: React.RefObject<HTMLElement>,
  disabled: false, 
) => {
  useEffect(() => {
    ref.current?.addEventListener(
      'pointerdown',
      (evt: TouchEvent) => {
        evt.preventDefault();
      },
      false,
    );
  }, [disabled]);
};

/**
 * This hook monitors an dom element's dimension
 * @param ref reference to the html element
 * @returns the update container size.
 */
export const useMonitorResizable = (
  ref: React.RefObject<HTMLElement>,
): RectSize => {
  const [containerSize, setContainerSize] = React.useState({
    width: 10,
    height: 10,
  });

  // add obsever to the content viewer container
  React.useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        setContainerSize({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      }
    });

    const element = ref.current;
    if (element) {
      ro.observe(element);
    }
    return () => ro.disconnect();
  }, [ref]);

  return containerSize;
};

/**
 *
 * @param posOri the offset from the image top left corner to the container
 * @param pointerPosOri start pointer position relative to container
 * @param pointerPosNow current pointer position relative to container
 * @param scaleOri original scale factor
 * @param scaleNow current scale factor
 */
const getNewPosition = (
  posOri: number,
  pointerPosOri: number,
  scaleOri: number,
  pointerPosNow: number,
  scaleNow: number,
) => {
  // the pointer position in object space,
  // the relative center for zoom/pinch.
  const objPos = (pointerPosOri - posOri) / scaleOri;
  return pointerPosNow - objPos * scaleNow;
};

export const useTouchPanZoom = (
  panZoomState: PanZoomSpec,
  setPanZoomState: React.Dispatch<React.SetStateAction<PanZoomSpec>>,
  contentFitSpec: React.MutableRefObject<PanZoomBounds>,
) => {
  const touchState = useRef<{ start: Coords[]; oriPanZoom: PanZoomSpec }>();
  const [inProgress, setInProgress] = useState(false);

  const handleTouchMove = (evt: React.TouchEvent) => {
    if (evt.touches.length !== 2 || !touchState.current) return;
    setInProgress(true);

    const oriPanZoom = touchState.current.oriPanZoom;
    const touchesStart = touchState.current.start;
    const touchesNow = getTouchCoords(evt);

    const startMid = getMidPoint([touchesStart[0], touchesStart[1]]);
    const nowMid = getMidPoint(touchesNow);

    const distancePrev = getDistance([touchesStart[0], touchesStart[1]]);
    const distanceNow = getDistance(touchesNow);
    let scale = (distanceNow / distancePrev) * oriPanZoom.scale;

    //  bound it.
    scale = Math.min(
      contentFitSpec.current.max * contentFitSpec.current.fitSpec.scale,
      Math.max(
        contentFitSpec.current.min * contentFitSpec.current.fitSpec.scale,
        scale,
      ),
    );

    const x = getNewPosition(
      oriPanZoom.x,
      startMid[0],
      oriPanZoom.scale,
      nowMid[0],
      scale,
    );

    const y = getNewPosition(
      oriPanZoom.y,
      startMid[1],
      oriPanZoom.scale,
      nowMid[1],
      scale,
    );

    setPanZoomState({ x, y, scale });
  };

  return {
    onTouchStart: (evt: React.TouchEvent) => {
      touchState.current = {
        start: getTouchCoords(evt),
        oriPanZoom: { ...panZoomState },
      };
    },
    onTouchEnd: (evt: React.TouchEvent) => {
      if (evt.touches.length === 0) {
        touchState.current = undefined;
        setInProgress(false);
      }
    },
    onTouchMove: handleTouchMove,
    inProgress,
  };
};

export const useWheelZoom = (
  panZoomState: PanZoomSpec,
  setPanZoomState: React.Dispatch<React.SetStateAction<PanZoomSpec>>,
  contentFitSpec: React.MutableRefObject<PanZoomBounds>,
) => {
  const handleWheel = (evt: React.WheelEvent) => {
    const coords = getAbsoluteCoords(
      evt,
      evt.currentTarget.getBoundingClientRect(),
    );
    const scaleDelta = evt.deltaY * -0.01;
    let scale = panZoomState.scale + scaleDelta;

    //  bound it.
    scale = Math.min(
      contentFitSpec.current.max * contentFitSpec.current.fitSpec.scale,
      Math.max(
        contentFitSpec.current.min * contentFitSpec.current.fitSpec.scale,
        scale,
      ),
    );

    const x = getNewPosition(
      panZoomState.x,
      coords.x,
      panZoomState.scale,
      coords.x,
      scale,
    );
    const y = getNewPosition(
      panZoomState.y,
      coords.y,
      panZoomState.scale,
      coords.y,
      scale,
    );

    if (evt.deltaX === 0 && !Number.isInteger(evt.deltaY)) {
      setPanZoomState({ x, y, scale });
    }
  };

  return {
    onWheel: handleWheel,
  };
};

export const usePointerPan = (
  panZoomState: PanZoomSpec,
  setPanZoomState: React.Dispatch<React.SetStateAction<PanZoomSpec>>,
  disabled: boolean,
) => {
  const pointerState = useRef<{ start: Coords; oriPanZoom: PanZoomSpec }>();
  const [inProgress, setInProgress] = useState(false);

  return {
    onPointerDown: (evt: React.PointerEvent) => {
      if (disabled) return;

      const coords = getAbsoluteCoords(
        evt,
        evt.currentTarget.getBoundingClientRect(),
      );
      setInProgress(true);
      pointerState.current = { start: coords, oriPanZoom: { ...panZoomState } };
    },
    onPointerUp: () => {
      pointerState.current = undefined;
      setInProgress(false);
    },
    onPointerMove: (evt: React.PointerEvent) => {
      if (disabled) return;

      const coords = getAbsoluteCoords(
        evt,
        evt.currentTarget.getBoundingClientRect(),
      );

      if (pointerState.current) {
        const x = getNewPosition(
          pointerState.current.oriPanZoom.x,
          pointerState.current.start.x,
          pointerState.current.oriPanZoom.scale,
          coords.x,
          panZoomState.scale,
        );
        const y = getNewPosition(
          pointerState.current.oriPanZoom.y,
          pointerState.current.start.y,
          pointerState.current.oriPanZoom.scale,
          coords.y,
          panZoomState.scale,
        );        
        setPanZoomState({ x, y, scale: panZoomState.scale });
      }
    },
    inProgress,
  };
};
