import React, { useEffect, useState } from 'react';
import { useMonitorResizable, usePreventDefaultBrowserTouch, useTouchPanZoom } from './hooks';
import './style.css';
import { PanZoomSpec, RectSize } from './types';
import { getContentFitSpec } from './utils';

export const PanZoomContext = React.createContext({
  panZoomState: { x: 0, y: 0, scale: 1.0 },
  setPanZoomState: (state: PanZoomSpec) => {},
});


interface PanZoomProps {
  contentSize: RectSize;

  disabled?: boolean;
  isLoading?: boolean;
}

const PanZoom: React.FunctionComponent<PanZoomProps> = ({
  disabled = false,
  ...props
}) => {
  const [panZoomState, setPanZoomState] = useState({ x: 0, y: 0, scale: 1.0 });
  const topContainerRef = React.useRef<HTMLElement>(null);

  usePreventDefaultBrowserTouch(topContainerRef);

  // if either the container or content resize, center fit the content;
  const containerSize = useMonitorResizable(topContainerRef);
  useEffect(() => {
    setPanZoomState(getContentFitSpec(props.contentSize, containerSize));
  }, [props.contentSize, containerSize]);

  const touchHandlers = useTouchPanZoom(panZoomState, setPanZoomState);

  const transformWrapper = (
    <div
      ref={topContainerRef as React.Ref<HTMLDivElement>}
      className="panzoom_main"
      {...touchHandlers}
    >
      <div
        style={{
          transformOrigin: 'left top',
          transform: `translate(${panZoomState.x}px, ${panZoomState.y}px) scale(${panZoomState.scale})`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
  return transformWrapper;
};

export default PanZoom;
