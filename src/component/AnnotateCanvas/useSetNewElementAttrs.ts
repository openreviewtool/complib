import { useEffect, useState } from 'react';
import { AnnotateElement, UserControllerInputs } from './types';

/**
 * Depending on the shape context, set the create attributes
 * @param uiState
 * @returns properties from an annotate element.
 */
export default function useSetNewElementAttrs(
  uiState: UserControllerInputs,
): Partial<AnnotateElement> {
  const getElementDefaults = () => {
    const shape = uiState.shape;
    return {
      ...uiState,
      etype: shape,
      fill: (['Textbox', 'SVG'].indexOf(shape) !== -1
        ? uiState.color
        : '') as string,
      stroke: (['Textbox', 'SVG'].indexOf(shape) !== -1
        ? ''
        : uiState.color) as string,
      strokeWidth: (['Textbox'].indexOf(shape) !== -1
        ? 0
        : uiState.strokeWidth) as number,
    };
  };

  const [newElementDefault, setNewElementDefault] = useState(
    getElementDefaults(),
  );

  // Monitior the UI for the default settings for shape/font/color/stroke width
  // and save it to the new shape hash.
  useEffect(() => {
    // Todo: in a real use case, should only update to the defaults
    // if nothing is selected.
    setNewElementDefault(getElementDefaults());
  }, [
    uiState.mode,
    uiState.shape,
    uiState.fontSize,
    uiState.color,
    uiState.strokeWidth,
  ]);

  return newElementDefault;
}
