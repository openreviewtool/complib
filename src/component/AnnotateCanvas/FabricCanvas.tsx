import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CANVAS_ATTRS: Record<string, number | string | boolean> = {
  uniformScaling: false,
  preserveObjectStacking: true,
  targetFindTolerance: 10,
  // note: currently, canvas group selection only the selection rect with shape bounds.
  // ref: https://github.com/fabricjs/fabric.js/issues/3773
  // So next best thing is to require user's selection rect to contain the entire object.
  selectionFullyContained: true,
};

interface FabricCanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
  width?: number;
  height?: number;
  backgroundColor?: string;
  attrs?: Record<string, number | string | boolean>;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({
  width = 100,
  height = 100,
  backgroundColor = 'green',
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
};

export default FabricCanvas;
