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
    fObjRegistryRef.current = {};

    // add the elements
    const fObjs = await Promise.all(elements.map((ele) => makeFabricObj(ele)));

    elements.forEach((e, i) => {
      fObjRegistryRef.current[e.id] = fObjs[i]; // add to registry
    });

    fCanvas.clear();
    fCanvas.backgroundColor = backgroundColor;
    fabricCanvasRef.current.add(...(fObjs as fabric.Object[]));

    const selectedFObjs: fabric.Object[] = [];
    elements.forEach((e, i) => {
      // build selection list
      if (selection.includes(e.id)) {
        selectedFObjs.push(fObjs[i]);
      }
    });

    if (selectedFObjs.length === 1) {
      // deal with the issue when you create a textbox, putting in the group
      // will enable showing all the resize corders.
      fCanvas.setActiveObject(selectedFObjs[0]);
    } else if (selectedFObjs.length !== 0) {
      const s = new fabric.ActiveSelection(selectedFObjs, {
        canvas: fCanvas,
      });
      fCanvas.setActiveObject(s);
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
