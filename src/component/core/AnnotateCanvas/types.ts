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
    string | number | number[] | fabric.Object | undefined
  > {
  id: string;
  etype: AnnotateElementType;

  fabricObj?: fabric.Object;
}
const baseAttrNames = ['fill', 'stroke', 'strokeWidth'];

export interface UserControllerInputs {
  mode: CanvasMode;
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
      elementUpdates: Partial<AnnotateElement>;
    }
  | {
      type: 'addElement';
      newElement: AnnotateElement;
    }
  | {
      type: 'removeElement';
      removeIds: string[];
    };

export interface fObjExtend extends fabric.Object {
  id: string;
  etype: AnnotateElementType;

  // missing properties from the typescript wrapper.
  rx?: number;
  ry?: number;
  text?: string;
  _objects?: fObjExtend[]; // from group selections.
}

export interface fSelectionEvent extends fabric.IEvent {
  target: fObjExtend,
  selected: fObjExtend[],
  deselected: fObjExtend[],
}