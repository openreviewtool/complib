import React, { useRef, useState } from 'react';
import { useMonitorResizable } from './hooks';
import { PanZoomBounds, PanZoomSpec, RectSize } from './types';

interface PanZoomContextInterface {
  contentSize: RectSize;
  setContentSize: (_s: RectSize) => void;
  containerSize: RectSize;
  panZoom: PanZoomSpec;
  setPanZoom: (p: PanZoomSpec) => void;
  topContainerRef: React.RefObject<HTMLElement>;
  contentFitSpecRef: React.MutableRefObject<PanZoomBounds>;
}

const dummyConRef = React.createRef<HTMLElement>();
const dummyFitRef = {
  current: {
    fitSpec: { x: 0, y: 0, scale: 1.0 },
    min: 1,
    max: 1,
  },
};
export const PanZoomContext = React.createContext<PanZoomContextInterface>({
  contentSize: { width: 10, height: 10 },
  setContentSize: () => {},
  containerSize: { width: 10, height: 10 },
  panZoom: { x: 0, y: 0, scale: 1.0 },
  setPanZoom: () => {},
  topContainerRef: dummyConRef,
  contentFitSpecRef: dummyFitRef,
});

export const PanZoomContextProvider: React.FC<{}> = (props) => {
  const [panZoomState, setPanZoomState] = useState({ x: 0, y: 0, scale: 1.0 });

  const topContainerRef = useRef<HTMLElement>(null);
  const contentFitSpecRef = useRef<PanZoomBounds>({
    fitSpec: { x: 0, y: 0, scale: 1.0 },
    min: 1,
    max: 1,
  });

  // if either the container or content resize, center fit the content;
  const containerSize = useMonitorResizable(topContainerRef);
  const [contentSize, setContentSize] = useState({ width: 10, height: 10 });

  return (
    <PanZoomContext.Provider
      value={{
        panZoom: panZoomState,
        setPanZoom: setPanZoomState,
        containerSize,
        contentSize,
        setContentSize,
        topContainerRef,
        contentFitSpecRef,
      }}
    >
      {props.children}
    </PanZoomContext.Provider>
  );
};
