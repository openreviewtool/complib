import React, { useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_CANVAS_ATTRS } from './defaults';

interface FabricCanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
  width?: number;
  height?: number;
  backgroundColor?: string;
  attrs?: Record<string, number | string | boolean>;
}

// Memo is used here as re-render can cause recreation of the expensive
// canvas element.
const FabricCanvas: React.FC<FabricCanvasProps> = React.memo(
  ({
    width = 100,
    height = 100,
    backgroundColor = 'LightSteelBlue',
    attrs = DEFAULT_CANVAS_ATTRS,
    ...props
  }) => {
    const nativeCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

    // canvas resize
    React.useEffect(() => {
      props.fabricCanvasRef.current.setWidth(width);
      props.fabricCanvasRef.current.setHeight(height);
    }, [width, height]);

    React.useEffect(() => {
      props.fabricCanvasRef.current.backgroundColor = backgroundColor;
    }, [backgroundColor]);

    /**
     * use effect
     */
    // mount object modify handle
    useEffect(() => {
      if (nativeCanvasRef.current !== null) {
        props.fabricCanvasRef.current = new fabric.Canvas(
          nativeCanvasRef.current.id,
          {
            width,
            height,
            backgroundColor,
            ...attrs,
          },
        );
      }

      return () => {
        props.fabricCanvasRef.current?.dispose();
      };
    }, []);

    return <canvas ref={nativeCanvasRef} id={`canvas_${uuidv4()}`} />;
  },
);

export default FabricCanvas;
