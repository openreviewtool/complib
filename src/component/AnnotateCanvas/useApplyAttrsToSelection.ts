import { useEffect } from 'react';
import { AnnotateElement, UserControllerInputs } from './types';

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
  uiState: UserControllerInputs,
  selectedIds: string[],
  elements: AnnotateElement[],
  onChangeElement?: (element: Partial<AnnotateElement>) => void,
): void {
  const updateSelectedElement = (key: string, value: number | string) => {
    elements.forEach((element) => {
      if (selectedIds.indexOf(element.id) !== -1) {
        const etype = element.etype;
        let adjKey = key;

        if (etype === 'Textbox' && key === 'strokeWidth') return;

        if (key === 'color') {
          adjKey = etype === 'Textbox' ? 'fill' : 'stroke';
        }

        if (element.fabricObj) {
          element.fabricObj.set(adjKey as keyof fabric.Object, value);
        }
        if (onChangeElement) {
          onChangeElement({ ...element, [adjKey]: value });
        }
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
