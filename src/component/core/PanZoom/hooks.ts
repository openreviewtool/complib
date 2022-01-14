import React, { useEffect, useRef } from 'react';
import { Coords, PanZoomSpec, RectSize } from './types';
import { getTouchCoords, getTouchMoveSpec } from './utils';

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

export const useTouchPanZoom = (
  panZoomState: PanZoomSpec,
  setPanZoomState: React.Dispatch<React.SetStateAction<PanZoomSpec>>
) => {
  const touchState = useRef<{ start: Coords[]; oriPanZoom: PanZoomSpec }>();

  const handleTouchMove = (evt: React.TouchEvent) => {
    if (evt.touches.length !== 2 || !touchState.current) return;
    const oriPanZoom = touchState.current.oriPanZoom;
    const touchesStart = touchState.current.start;
    const touchesNow = getTouchCoords(evt);

    const updatedPanZoomSpec = getTouchMoveSpec(
      oriPanZoom,
      touchesStart,
      touchesNow,
    );

    setPanZoomState(updatedPanZoomSpec);
  };

  return {
    onTouchStart: (evt: React.TouchEvent) => {
      touchState.current = {
        start: getTouchCoords(evt),
        oriPanZoom: { ...panZoomState },
      };
    },
    onTouchEnd: () => {
      touchState.current = undefined;
    },
    onTouchMove: handleTouchMove,
  };
};