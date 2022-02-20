import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { makeFabricObj } from './../utils';
import { AnnotateElement, fObjExtend } from './../types';

function useRedrawElements(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  fObjRegistryRef: React.MutableRefObject<{
    [elmId: string]: fObjExtend;
  }>,
  selection: string[],
  backgroundColor: string,
  elements: AnnotateElement[],
  redrawOnModify: boolean,
): void {
  const redrawCanvas = async (fCanvas: fabric.Canvas) => {
    fCanvas.clear();
    fObjRegistryRef.current = {};
    fCanvas.backgroundColor = backgroundColor;

    // add the elements
    const fObjs = await Promise.all(elements.map((ele) => makeFabricObj(ele)));
    const selectedFObjs: fabric.Object[] = [];
    elements.forEach((e, i) => {
      fObjRegistryRef.current[e.id] = fObjs[i]; // add to registry
      fCanvas.add(fObjs[i]); // add to canvas
      // build selection list
      if (selection.includes(e.id)) {
        selectedFObjs.push(fObjs[i]);
      }
    });
    if (selectedFObjs.length !== 0) {
      const selection = new fabric.ActiveSelection(selectedFObjs, {
        canvas: fCanvas,
      });
      fCanvas.setActiveObject(selection);
    }
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
