import React, { useContext, useLayoutEffect } from 'react';
import { usePointerPan, useTouchPanZoom, useWheelZoom } from './hooks';
import { PanZoomSpec, RectSize } from './types';
import { getContentFitSpec } from './utils';

import {
  isTablet,
  usePreventDefaultBrowserTouch,
  usePreventDefaultBrowserWheel,
} from '../../utils/browser';
import { PanZoomContext, PanZoomContextProvider } from './PanZoomContext';

import './style.css';

interface PanZoomProps {
  disabled?: boolean;
  isLoading?: boolean;

  // zoom factor relative to the container rather than the image resolution.
  zoomBounds?: { min: number; max: number };
}

export interface PanZoomOverlayProps {
  render?: (
    panZoom: PanZoomSpec,
    contentSize: RectSize,
    containerSize: RectSize,
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
        ? props.render(ctx.panZoom, ctx.contentSize, ctx.containerSize)
        : props.children}
    </div>
  );
};

/**
 * content that consume the context but not  affected by the panzoom.
 * @param props
 */
export const PanZoomPassive = (props: { children: JSX.Element }) => {
  return props.children;
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
        position: 'relative',
        userSelect: 'none',
        transition: 'transform 0.05s',
        transform: `translate(${ctx.panZoom.x}px, ${ctx.panZoom.y}px) scale(${ctx.panZoom.scale})`,
        ...ctx.contentSize,
      }}
    >
      {props.render ? props.render(ctx.setContentSize) : props.children}
    </div>
  );
};

const PanZoomWithContext: React.FC<PanZoomProps> = (props) => {
  return (
    <PanZoomContextProvider>
      <PanZoomContainer {...props}>
        <div>{props.children}</div>
      </PanZoomContainer>
    </PanZoomContextProvider>
  );
};

export const PanZoomContainer: React.FC<PanZoomProps> = ({
  disabled = false,
  zoomBounds = { min: 0.5, max: 5 },

  ...props
}) => {
  const {
    topContainerRef,
    containerSize,
    contentSize,
    panZoom: panZoomState,
    setPanZoom: setPanZoomState,
    contentFitSpecRef,
  } = useContext(PanZoomContext);

  usePreventDefaultBrowserTouch(topContainerRef);
  usePreventDefaultBrowserWheel(topContainerRef);

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
  );
  const { inProgress: pointerPanCaptured, ...pointerHandler } = usePointerPan(
    panZoomState,
    setPanZoomState,
    disabled || touchCaptured,
  );
  const flgTablet = isTablet();

  const transformWrapper = (
    <div
      ref={topContainerRef as React.Ref<HTMLDivElement>}
      className="panzoom_top_container"
      {...(flgTablet ? touchHandlers : {})}
      {...(flgTablet ? {} : wheelHandler)}
      {...(flgTablet ? {} : pointerHandler)}
    >
      {props.children}
    </div>
  );
  return transformWrapper;
};

export default PanZoomWithContext;
