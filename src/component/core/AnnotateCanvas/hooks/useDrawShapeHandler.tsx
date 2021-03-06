import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { v4 as uuid4 } from 'uuid';
import {
  makeFabricObj,
  getElementPropsFromUiState,
  makeElement,
  makeElementId,
} from './../utils';
import { AnnotateElement, fObjExtend, UserControllerInputs } from './../types';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { FabricObjectDefaults } from './../defaults';

const SHAPES = ['Ellipse', 'Rect', 'Circle', 'Triangle', 'Textbox'];

// temporary holds the preiew element while it's drawn.
export interface NewShape {
  newFObjExt: fObjExtend;

  originX: number;
  originY: number;

  svgUrl?: string;
}

function useDrawShapeHandler(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  fObjRegistryRef: React.MutableRefObject<{
    [elmId: string]: fObjExtend;
  }>,
  uiState: UserControllerInputs,
  onAddElement?: (element: AnnotateElement) => void,
  disabled?: boolean,
): void {
  const uiStateRef = React.useRef<UserControllerInputs>(uiState);
  const onAddElementFuncRef = React.useRef(onAddElement);

  useEffect(() => {
    onAddElementFuncRef.current = onAddElement;
  }, [onAddElement]);

  React.useEffect(() => {
    const fcanvas = fabricCanvasRef.current;
    fcanvas.on('mouse:down', draw_shape_handle_pointer_down);
    fcanvas.on('mouse:move', draw_shape_handle_pointer_move);
    fcanvas.on('mouse:up', draw_shape_handle_pointer_up);
    fcanvas.on('path:created', handle_path_created);
    fcanvas.defaultCursor = 'crosshair';
  }, []);

  React.useEffect(() => {
    uiStateRef.current = uiState;

    const fcanvas = fabricCanvasRef.current;
    if (
      (fcanvas.isDrawingMode =
        uiState.mode === 'draw' && uiState.shape === 'Path')
    ) {
      syncBrush(fcanvas);
    }
  }, [uiState]);

  const syncBrush = (fcanvas: fabric.Canvas) => {
    const brush = fcanvas.freeDrawingBrush;
    brush.width = uiState.strokeWidth || 1;
    brush.color = uiState.color || '#fff';
    fcanvas.freeDrawingBrush = brush;
  };

  const setPathDrawing = (
    fcanvas: fabric.Canvas,
    uiState: UserControllerInputs,
  ) => {
    // setting the free draw mode
    fcanvas.isDrawingMode = uiState.mode === 'draw' && uiState.shape === 'Path';
    syncBrush(fcanvas);
  };

  const handle_path_created = (meta: IEvent) => {
    const fObj: fObjExtend = (meta as any).path;

    let k: keyof typeof FabricObjectDefaults;
    for (k in FabricObjectDefaults) {
      fObj.set(k, FabricObjectDefaults[k]);
    }
    fObj.etype = 'Path';
    fObj.id = makeElementId('Path');
    onAddElementFuncRef.current?.(makeElement(fObj));
    fObjRegistryRef.current[fObj.id] = fObj;
  };

  React.useEffect(() => {
    const fcanvas = fabricCanvasRef.current;
    if (uiState.mode) {
      setPathDrawing(fcanvas, uiState);
      const isDrawingMode = uiState.mode === 'draw';
      fcanvas.selection = !disabled && !isDrawingMode;
      fcanvas.defaultCursor = isDrawingMode ? 'crosshair' : '';
      fcanvas.skipTargetFind = isDrawingMode;
    }
  }, [uiState.mode, uiState.shape, uiState.shape, disabled]);

  const currentShapeDrawnRef = React.useRef<NewShape | null>(null);

  const draw_shape_handle_pointer_down = useCallback((opt: fabric.IEvent) => {
    const isDrawinShape =
      uiStateRef.current?.mode === 'draw' &&
      SHAPES.indexOf(uiStateRef.current?.shape) !== -1;

    if (!isDrawinShape) return;

    const fcanvas = fabricCanvasRef.current;
    const pointer = fcanvas.getPointer(opt.e);
    const [originX, originY] = [pointer.x, pointer.y];

    const newElementDefaults = getElementPropsFromUiState(uiStateRef.current);

    // this is a preview element.
    makeFabricObj({
      ...newElementDefaults,
      id: makeElementId(newElementDefaults.etype!),
      transformMatrix: [1, 0, 0, 1, originX, originY],
    }).then((shape) => {
      fcanvas.add(shape);
      currentShapeDrawnRef.current = {
        originX,
        originY,
        newFObjExt: shape,
      };
      if (shape && shape.etype === 'Textbox') {
        fcanvas.setActiveObject(shape);
        shape.enterEditing!();
        shape.selectAll!();
        shape.selectionBackgroundColor = '#0006';
      }
    });
  }, []);

  const draw_shape_handle_pointer_move = useCallback((opt: fabric.IEvent) => {
    const isDrawinShape =
      uiStateRef.current?.shape !== 'Textbox' &&
      uiStateRef.current?.mode === 'draw' &&
      SHAPES.indexOf(uiStateRef.current?.shape) !== -1;

    if (currentShapeDrawnRef.current === null || !isDrawinShape) return;

    const fcanvas = fabricCanvasRef.current;
    const pointer = fcanvas.getPointer(opt.e);
    const { originX, originY } = currentShapeDrawnRef.current;
    const fabObj = currentShapeDrawnRef.current.newFObjExt;

    if (SHAPES.indexOf(fabObj.etype) !== -1) {
      fabObj.set({
        left: Math.min(originX, pointer.x),
        top: Math.min(originY, pointer.y),
      });
    } else {
      fabObj.set({ left: pointer.x, top: pointer.y });
    }

    if (fabObj.etype === 'Ellipse') {
      fabObj.set({ rx: Math.abs(originX - pointer.x) / 2 });
      fabObj.set({ ry: Math.abs(originY - pointer.y) / 2 });
    } else if (fabObj.etype === 'Rect') {
      fabObj.set({ width: Math.abs(originX - pointer.x) });
      fabObj.set({ height: Math.abs(originY - pointer.y) });
    }
    fabObj.setCoords();
    fcanvas.requestRenderAll();
  }, []);

  const draw_shape_handle_pointer_up = useCallback((_opt: fabric.IEvent) => {
    const isDrawinShape =
      // uiStateRef.current?.mode === 'draw' &&
      SHAPES.indexOf(uiStateRef.current?.shape) !== -1;

    const fcanvas = fabricCanvasRef.current;
    if (currentShapeDrawnRef.current === null || !isDrawinShape) return;

    const { newFObjExt } = currentShapeDrawnRef.current;

    if (
      SHAPES.indexOf(newFObjExt.etype) !== -1 &&
      (newFObjExt!.width! < 4 || newFObjExt!.height! < 4)
    ) {
      // don't add it if it's too small
      fcanvas?.remove(newFObjExt);
    } else {
      onAddElementFuncRef.current?.(makeElement(newFObjExt));
      fObjRegistryRef.current[newFObjExt.id] = newFObjExt;
    }

    currentShapeDrawnRef.current = null;
  }, []);
}

export default useDrawShapeHandler;
