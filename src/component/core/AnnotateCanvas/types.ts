import { fabric } from 'fabric';

export type CanvasMode = 'draw' | 'selection' | 'panZoom';

export type FabricElementType =
  | 'Rect'
  | 'Circle'
  | 'Ellipse'
  | 'Path'
  | 'Textbox';
export type AnnotateElementType = FabricElementType | 'SVG';

export const FabricElementList = [
  'Rect',
  'Circle',
  'Ellipse',
  'Path',
  'Textbox',
];
export const AnnotateElementList = [...FabricElementList, 'SVG'];

export interface AnnotateElement
  extends Record<
    string,
    string | number | number[] | undefined | (string | number)[][]
  > {
  id: string;
  etype: AnnotateElementType;
}
const baseAttrNames = ['fill', 'stroke', 'strokeWidth'];

// annotateElement: a mark
// list annotateElement: a sketch
// list of sketch: media annotation
export interface TimedSketch {
  id: string;
  time: number; // this is the time in the sequence, ex: video time/frame
  sketch: AnnotateElement[];
}

export interface UserControllerInputs {
  mode: CanvasMode;
  showAnnotation: boolean;
  shape: AnnotateElementType;
  fontSize: number;
  color: string;
  strokeWidth: number;
  fontFamily: string;
}

export interface UserSelectionConfig {
  perPixelSelection: boolean;
  selectionColor: string;
  hoverBoundingBox: boolean;
}

export const fabricObjAttrsLookup: Record<string, string[]> = {
  Rect: [...baseAttrNames, 'width', 'height'],
  Circle: [...baseAttrNames, 'radius'],
  Ellipse: [...baseAttrNames, 'rx', 'ry'],
  Textbox: [
    ...baseAttrNames,
    'text',
    'fontFamily',
    'fontSize',
    'width',
    'height',
  ],
  Path: [...baseAttrNames, 'path'],
  SVG: [], // placeholder
};

export type ElementsAction =
  | {
      type: 'changeElement';
      elementUpdates: Partial<AnnotateElement>[];
    }
  | {
      type: 'addElement';
      newElement: AnnotateElement;
    }
  | {
      type: 'removeElements';
      ids: string[];
    }
  | {
      type: 'updateSketch';
      sketch: AnnotateElement[];
    };

export interface fObjExtend extends fabric.Object {
  id: string;
  etype: AnnotateElementType;

  // missing properties from the typescript wrapper.
  rx?: number;
  ry?: number;
  _objects?: fObjExtend[]; // from group selections.

  // for textbox objects
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface fSelectionEvent extends fabric.IEvent {
  target: fObjExtend;
  selected: fObjExtend[];
  deselected: fObjExtend[];
}
