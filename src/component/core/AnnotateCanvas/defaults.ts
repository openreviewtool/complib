import { UserControllerInputs, UserSelectionConfig } from "./types";

export const DEFAULT_UI_ATTRS: UserControllerInputs = {
  mode: 'selection',
  showAnnotation: true,
  shape: 'Rect',
  fontSize: 20,
  // color: 'DeepSkyBlue',
  // color: 'DodgerBlue',
  color: 'Coral',
  strokeWidth: 3,
  fontFamily: 'Times New Roman',
};

export const DEFAULT_CANVAS_ATTRS: Record<string, number | string | boolean> = {
  uniformScaling: false,
  preserveObjectStacking: true,
  targetFindTolerance: 10,
  // note: currently, canvas group selection only the selection rect with shape bounds.
  // ref: https://github.com/fabricjs/fabric.js/issues/3773
  // So next best thing is to require user's selection rect to contain the entire object.
  // selectionFullyContained: true,
};

export const DEFAULT_SELECTION_CONFIG: UserSelectionConfig = {
  perPixelSelection: false,
  selectionColor: 'Azure',
  hoverBoundingBox: true,
}

export const FabricObjectDefaults = {
  // perPixelTargetFind: true,
  noScaleCache: false,
  strokeUniform: true,
};

export const HAS_ROTATE_HANDLE = true