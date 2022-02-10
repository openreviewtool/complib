import React, { useContext, useEffect, useState } from 'react';

import { normalizeScale } from '../core/PanZoom/utils';
import {
  AnnotateElement,
  UserControllerInputs,
} from '../core/AnnotateCanvas/types';
import { PanZoomContext } from '../core/PanZoom/PanZoom';
import AnnotateCanvasComp from '../core/AnnotateCanvas/AnnotateCanvas';
import BrushTools from '../core/AnnotateCanvas/UI/BrushTools';
import EditTools from '../core/AnnotateCanvas/UI/EditTools';
import { MediaAnnotateContext } from '../core/AnnotateCanvas/MediaAnnotateContext';
import { PlayerContext } from '../core/MediaPlayer/PlayerContext';
import { getWholeMSecTime } from '../core/AnnotateCanvas/utils';

export const AnnotateCanvas = (props: {
  uiState: UserControllerInputs;
  setUiState: (u: UserControllerInputs) => void;
}) => {
  const { containerSize, panZoom, contentSize } = useContext(PanZoomContext);
  const { elements, onAddElement, onChangeElement, selection, onSelection } =
    useContext(MediaAnnotateContext);
  const [normPanZoomSpec, setNormPanZoomSpec] = useState(panZoom);
  // const [selection, setSelection] = useState<string[]>([]);

  // normalize the annotate canvas to have 1000x1000 regardless of the content
  useEffect(
    () =>
      setNormPanZoomSpec({
        ...panZoom,
        scale: normalizeScale(contentSize, panZoom.scale, 1000),
      }),
    [panZoom],
  );

  // // auto select newly created shape (except path).
  const onAddElementHelper = (elm: AnnotateElement) => {
    onAddElement(elm);
    if (elm.etype !== 'Path') {
      props.setUiState({ ...props.uiState, mode: 'selection' });
      window.setTimeout(onSelection, 100, [elm.id]);
    }
  };

  return props.uiState.showAnnotation ? (
    <AnnotateCanvasComp
      elements={elements}
      selection={selection}
      onSelection={onSelection}
      width={containerSize.width}
      height={containerSize.height}
      panZoom={normPanZoomSpec}
      uiState={props.uiState}
      setUiState={props.setUiState}
      disabled={props.uiState.mode === 'panZoom'}
      onAddElement={onAddElementHelper}
      onChangeElement={onChangeElement}
      clearOnElementModify={true}
    />
  ) : null;
};

export const AnnotateTools = (props: {
  uiState: UserControllerInputs;
  setUiState: (u: UserControllerInputs) => void;
}) => {
  const { playerState } = useContext(PlayerContext)
  const { isKey, keyTime, onAddKey, onRemoveKey, selection, onRemoveElements } =
    useContext(MediaAnnotateContext);
  return (
    <>
      <BrushTools uiState={props.uiState} setUIState={props.setUiState} />
      <EditTools
        uiState={props.uiState}
        setUIState={props.setUiState}
        onAddKey={onAddKey}
        disableAddKey={keyTime===getWholeMSecTime(playerState.played)}
        onRemoveKey={onRemoveKey}
        disableRemoveKey={!isKey}
        onDeleteSelection={() => onRemoveElements(selection)}
        disableDeleteSelection={selection.length === 0}
      />
    </>
  );
};
