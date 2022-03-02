import { useEffect } from 'react';
import { AnnotateElement, fObjExtend, UserControllerInputs } from '../types';

/**
 * Depending on the type of element, the ui controls state affects the element attribute differently.
 * This hook examines the selected element and the ui state change, and instructs the apply handler.
 * @param uiState The state of the ui controls
 * @param selectedIds The current selected ids
 * @param elements all the annotation elements
 * @param applyUpdatesHandler
 */
export default function useApplyAttrsToSelection(
  canvasRef: React.MutableRefObject<fabric.Canvas>,
  fObjRegistryRef: React.MutableRefObject<{
    [elmId: string]: fObjExtend;
  }>,
  uiState: UserControllerInputs,
  selectedIds: string[],
  elements: AnnotateElement[],
  onChangeElement?: (element: Partial<AnnotateElement>[]) => void,
): void {
  const updateSelectedElement = (key: string, value: number | string) => {
    const changeBatch: Partial<AnnotateElement>[] = [];
    elements.forEach((element) => {
      if (selectedIds.indexOf(element.id) !== -1) {
        const etype = element.etype;
        let adjKey = key;

        if (etype === 'Textbox' && key === 'strokeWidth') return;

        if (key === 'color') {
          adjKey = etype === 'Textbox' ? 'fill' : 'stroke';
        }

        const fObj = fObjRegistryRef.current[element.id];
        if (fObj && fObj.get(adjKey as keyof fabric.Object) !== value) {
          fObj.set(adjKey as keyof fabric.Object, value);

          changeBatch.push({
            id: element.id,
            transformMatrix: fObj.calcTransformMatrix(),
            [adjKey]: value,
          });
        }
      }
      if (onChangeElement && changeBatch.length !== 0) {
        onChangeElement(changeBatch);
      }
    });
    canvasRef.current.renderAll();
  };

  useEffect(
    () => updateSelectedElement('fontSize', uiState.fontSize),
    [uiState.fontSize],
  );
  useEffect(
    () => updateSelectedElement('strokeWidth', uiState.strokeWidth),
    [uiState.strokeWidth],
  );
  useEffect(
    () => updateSelectedElement('color', uiState.color),
    [uiState.color],
  );
}
