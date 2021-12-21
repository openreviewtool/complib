import { UserControllerInputs, UserSelectionConfig } from "./types";

export const DEFAULT_UI_ATTRS: UserControllerInputs = {
  mode: 'draw',
  shape: 'Rect',
  fontSize: 12,
  color: 'blue',
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
  selectionColor: 'MintCream',
  hoverBoundingBox: true,
}

export const FabricObjectDefaults = {
  // perPixelTargetFind: true,
  noScaleCache: false,
  strokeUniform: true,
};

export const HAS_ROTATE_HANDLE = true