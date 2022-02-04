import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  useMonitorResizable,
  usePointerPan,
  useTouchPanZoom,
  useWheelZoom,
} from './hooks';
import { PanZoomBounds, PanZoomSpec, RectSize } from './types';
import { getContentFitSpec, normalizeSize } from './utils';

import './style.css';
import {
  usePreventDefaultBrowserTouch,
  usePreventDefaultBrowserWheel,
} from '../../utils/browser';

interface PanZoomProps {
  disabled?: boolean;
  isLoading?: boolean;

  // zoom factor relative to the container rather than the image resolution.
  zoomBounds?: { min: number; max: number };

  onPanZoom?: (p: PanZoomSpec) => void;
}

export const PanZoomContext = React.createContext({
  inProgress: false,
  contentSize: { width: 10, height: 10 },
  setContentSize: (_s: RectSize) => {},
  containerSize: { width: 10, height: 10 },
  panZoom: { x: 0, y: 0, scale: 1.0 },
});

export interface PanZoomOverlayProps {
  render?: (
    panZoom: PanZoomSpec,
    contentSize: RectSize,
    containerSize: RectSize,
    inProgress: boolean,
  ) => JSX.Element;
  pointerEventPassthrough?: boolean;
  children?: JSX.Element;
}
export const PanZoomOverlay = (props: PanZoomOverlayProps) => {
  const ctx = useContext(PanZoomContext);
  return (
    <div
      className="panzoom_overlay"
      style={{
        pointerEvents: props.pointerEventPassthrough ? 'none' : undefined,
      }}
    >
      {props.render
        ? props.render(
            ctx.panZoom,
            ctx.contentSize,
            ctx.containerSize,
            ctx.inProgress,
          )
        : props.children}
    </div>
  );
};

export interface PanZoomContentProps {
  render?: (setContentSize: (s: RectSize) => void) => JSX.Element;
  normalizeRes?: number;
  children?: JSX.Element;
}

export const PanZoomContent = (props: PanZoomContentProps) => {
  const ctx = useContext(PanZoomContext);

  return (
    <div
      style={{
        transformOrigin: 'left top',
        transform: `translate(${ctx.panZoom.x}px, ${ctx.panZoom.y}px) scale(${ctx.panZoom.scale})`,
        position: 'relative',
        ...ctx.contentSize,
      }}
    >
      {props.render
        ? props.render(ctx.setContentSize)
        : props.children}
      {/* {props.normalizeRes
        ? props.render((s) => {
            ctx.setContentSize(normalizeSize(s, props.normalizeRes!));
          })
        : props.render(ctx.setContentSize)} */}
    </div>
  );
};

const PanZoom: React.FunctionComponent<PanZoomProps> = ({
  disabled = false,
  zoomBounds = { min: 0.5, max: 5 },

  ...props
}) => {
  const [panZoomState, setPanZoomState] = useState({ x: 0, y: 0, scale: 1.0 });
  const contentFitSpecRef = useRef<PanZoomBounds>({
    fitSpec: { x: 0, y: 0, scale: 1.0 },
    min: 1,
    max: 1,
  });

  const topContainerRef = React.useRef<HTMLElement>(null);

  usePreventDefaultBrowserTouch(topContainerRef);
  usePreventDefaultBrowserWheel(topContainerRef);

  // if either the container or content resize, center fit the content;
  const containerSize = useMonitorResizable(topContainerRef);
  const [contentSize, setContentSize] = useState({ width: 10, height: 10 });

  useLayoutEffect(() => {
    const fitSpec = getContentFitSpec(contentSize, containerSize);
    contentFitSpecRef.current = { fitSpec, ...zoomBounds };
    setPanZoomState(fitSpec);
  }, [contentSize, containerSize]);

  const { inProgress: touchCaptured, ...touchHandlers } = useTouchPanZoom(
    panZoomState,
    setPanZoomState,
    contentFitSpecRef,
    disabled,
  );
  const wheelHandler = useWheelZoom(
    panZoomState,
    setPanZoomState,
    contentFitSpecRef,
    // disabled,
  );
  const { inProgress: pointerPanCaptured, ...pointerHandler } = usePointerPan(
    panZoomState,
    setPanZoomState,
    disabled || touchCaptured,
  );

  useEffect(() => {
    if (props.onPanZoom) {
      props.onPanZoom(panZoomState);
    }
  }, [panZoomState]);

  const transformWrapper = (
    <div
      ref={topContainerRef as React.Ref<HTMLDivElement>}
      className="panzoom_top_container"
      {...touchHandlers}
      {...wheelHandler}
      {...pointerHandler}
    >
      <PanZoomContext.Provider
        value={{
          panZoom: panZoomState,
          inProgress: touchCaptured,
          containerSize,
          contentSize,
          setContentSize,
        }}
      >
        {props.children}
      </PanZoomContext.Provider>
    </div>
  );
  return transformWrapper;
};

export default PanZoom;
