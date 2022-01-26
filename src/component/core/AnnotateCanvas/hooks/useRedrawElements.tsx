import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { makeFabricObj } from './utils';
import { AnnotateElement } from './types';

function useRedrawElements(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  backgroundColor: string,
  elements: AnnotateElement[],
  redrawOnModify: boolean, 
): void {
  const redrawCanvas = (fCanvas: fabric.Canvas) => {
    fCanvas.clear();
    fCanvas.backgroundColor = backgroundColor;

    // add the elements
    elements.forEach((ele) => {
      makeFabricObj(ele).then((shape) => {
        fCanvas.add(shape);
        ele.fabricObj = shape;
      });
    });
  };

  useEffect(() => {
    if (redrawOnModify) {
      redrawCanvas(fabricCanvasRef.current);
    }
  }, [elements]);

  useEffect(() => {
    if (!redrawOnModify) {
      redrawCanvas(fabricCanvasRef.current);
    }
  }, []);
}

export default useRedrawElements;
