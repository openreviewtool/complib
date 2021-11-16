import React from 'react';
import { useCallback } from 'react';
import {
  makeFabricObj,
  getElementPropsFromUiState,
  FabricObjectDefaults,
} from './utils';
import { AnnotateElementType, fObjExtend, UserControllerInputs } from './types';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';

const SHAPES = ['Ellipse', 'Rect', 'Circle', 'Triangle'];

export interface NewShape {
  etype: AnnotateElementType;

  fabObj: fabric.Object;

  originX: number;
  originY: number;

  svgUrl?: string;
}

function useDrawShapeHandler(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  uiState: UserControllerInputs,
  onAddElement?: (etype: AnnotateElementType, element: fabric.Object) => void,
): void {
  const uiStateRef = React.useRef<UserControllerInputs>(uiState);

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
  }, [uiState]);

  const setPathDrawing = (
    fcanvas: fabric.Canvas,
    uiState: UserControllerInputs,
  ) => {
    // setting the free draw mode
    fcanvas.isDrawingMode = uiState.mode === 'draw' && uiState.shape === 'Path';
    const brush = fcanvas.freeDrawingBrush;
    brush.width = uiState.strokeWidth || 1;
    brush.color = uiState.color || '#fff';
    fcanvas.freeDrawingBrush = brush;
  };

  const handle_path_created = (meta: IEvent) => {
    const fObj: fabric.Object = (meta as any).path;

    let k: keyof typeof FabricObjectDefaults;
    for (k in FabricObjectDefaults) {
      fObj.set(k, FabricObjectDefaults[k]);
    }

    onAddElement?.('Path', fObj);
  };

  React.useEffect(() => {
    const fcanvas = fabricCanvasRef.current;
    if (uiState.mode) {
      setPathDrawing(fcanvas, uiState);
      const isDrawingMode = uiState.mode === 'draw';

      fcanvas.selection = !isDrawingMode;
      fcanvas.defaultCursor = isDrawingMode ? 'crosshair' : '';
      fcanvas.skipTargetFind = isDrawingMode;
    }
  }, [uiState.mode, uiState.shape, uiState.shape]);

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

    makeFabricObj({
      ...newElementDefaults,
      transformMatrix: [1, 0, 0, 1, originX, originY],
    }).then((shape) => {
      fcanvas.add(shape);
      currentShapeDrawnRef.current = {
        etype: newElementDefaults.etype!,
        originX,
        originY,
        fabObj: shape,
      };
    });
  }, []);

  const draw_shape_handle_pointer_move = useCallback((opt: fabric.IEvent) => {
    const isDrawinShape =
      uiStateRef.current?.mode === 'draw' &&
      SHAPES.indexOf(uiStateRef.current?.shape) !== -1;

    if (currentShapeDrawnRef.current === null || !isDrawinShape) return;

    const fcanvas = fabricCanvasRef.current;
    const pointer = fcanvas.getPointer(opt.e);
    const { originX, originY } = currentShapeDrawnRef.current;
    const fabObj = currentShapeDrawnRef.current.fabObj as fObjExtend;

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

    fcanvas.renderAll();
  }, []);

  const draw_shape_handle_pointer_up = useCallback((opt: fabric.IEvent) => {
    const isDrawinShape =
      uiStateRef.current?.mode === 'draw' &&
      SHAPES.indexOf(uiStateRef.current?.shape) !== -1;

    const fcanvas = fabricCanvasRef.current;
    if (currentShapeDrawnRef.current === null || !isDrawinShape) return;

    const newShape = currentShapeDrawnRef.current;

    if (
      SHAPES.indexOf(newShape.etype) !== -1 &&
      (newShape.fabObj!.width! < 4 || newShape.fabObj!.height! < 4)
    ) {
      // don't add it if it's too small
      fcanvas?.remove(newShape.fabObj);
    } else {
      onAddElement?.(newShape.etype, newShape.fabObj);

      // selection
      fcanvas.setActiveObject(newShape.fabObj);
      fcanvas.requestRenderAll();
    }

    currentShapeDrawnRef.current = null;
  }, []);
}

export default useDrawShapeHandler;
