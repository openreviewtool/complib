import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { makeFabricObj } from './../utils';
import { AnnotateElement, fObjExtend } from './../types';

function useRedrawElements(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  fObjRegistryRef: React.MutableRefObject<{
    [elmId: string]: fObjExtend;
  }>,
  backgroundColor: string,
  elements: AnnotateElement[],
  redrawOnModify: boolean, 
): void {
  const redrawCanvas = (fCanvas: fabric.Canvas) => {
    fCanvas.clear();
    fObjRegistryRef.current = {};
    fCanvas.backgroundColor = backgroundColor;

    // add the elements
    elements.forEach((ele) => {
      makeFabricObj(ele).then((shape) => {
        fCanvas.add(shape);
        fObjRegistryRef.current[ele.id] = shape;
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
