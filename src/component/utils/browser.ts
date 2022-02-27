import { useEffect, useRef, useState } from 'react';

/**
 * PinchZoomPan gesture on a web page manipuate the entire website,
 * This prevents that for the reference element.
 * @param ref html dom element where default guesture will be disabled.
 */
export const usePreventDefaultBrowserTouch = (
  ref: React.RefObject<HTMLElement>,
  event?: string,
) => {
  useEffect(() => {
    ref.current?.addEventListener(
      event || 'touchstart',
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

const isIOS = (): boolean => {
  return (
    !!navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /Mac/.test(navigator.userAgent)
  );
};
const userAgent = navigator.userAgent.toLowerCase();
export const isTablet = (): boolean => {
  const queryAgent =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      userAgent,
    );
  return queryAgent || isIOS();
};

export const useFullScreen = () => {
  const element = useRef<HTMLDivElement>(null);

  const [fullScreen, setFullScreen] = useState(false);

  const syncFullScreen = () => {
    setFullScreen(!!document?.fullscreenElement);
  };
  useEffect(() => {
    element.current?.addEventListener('fullscreenchange', syncFullScreen);

    return () =>
      element.current?.removeEventListener('fullscreenchange', syncFullScreen);
  }, []);

  const toggleFullScreen = () => {
    if (!!document?.fullscreenElement) {
      document.exitFullscreen();
      syncFullScreen();
    } else {
      element.current
        ?.requestFullscreen()
        .then(syncFullScreen)
        .catch((err) => {
          alert(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
          );
        });
    }
  };

  return {
    fullScreenElement: element,
    fullScreen,
    setFullScreen: toggleFullScreen,
  };
};
