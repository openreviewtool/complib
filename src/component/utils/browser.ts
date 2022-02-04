import { useEffect } from 'react';

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

function isIOS() {
  return (
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /Mac/.test(navigator.userAgent)
  );
}
const userAgent = navigator.userAgent.toLowerCase();
export const isTablet = () => {
  return (
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      userAgent,
    ) || isIOS()
  );
};