import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { normalizeScale } from '../PanZoom/utils';

import * as playerComposer from '../MediaPlayer/playerComposer';
import elementsActionReducer from './elementActionReducer';
import { AnnotateElement, TimedSketch, UserControllerInputs } from './types';
import { PanZoomContext } from '../PanZoom/PanZoom';
import AnnotateCanvasComp from './AnnotateCanvas';

interface AnnotateContextInteface {
  mediaAnnotation: TimedSketch[];
  setMediaAnnotation?: (s: TimedSketch[]) => void;
}

export const AnnotateContext = React.createContext<AnnotateContextInteface>({
  mediaAnnotation: [],
});

/**
 * find the sketch best matching the current time
 * @param mediaAnnotation
 * @param currentTime
 * @param hold
 * @param fps
 * @returns
 */
const findAnnotation = (
  mediaAnnotation: TimedSketch[],
  currentTime: number, // in millisec
  hold?: boolean,
  fps?: number,
): {
  sketch: AnnotateElement[] | null;
  keyTime: number | null;
  isKey: boolean;
} => {
  hold = hold === undefined ? false : true;
  fps = fps || 24;

  const frameDurationInMSec = (1 / fps) * 1000;

  // find the matching key for the time.
  let matchSketch: AnnotateElement[] | null = null;
  let matchKeyTime = null;
  let isKey = false;
  for (let i = 0; i < mediaAnnotation.length; i++) {
    const { time: keyTime, sketch } = mediaAnnotation[i];
    if (currentTime >= keyTime && currentTime < keyTime + frameDurationInMSec) {
      matchSketch = sketch;
      matchKeyTime = keyTime;
      isKey = true;
      break;
    }
    if (hold && currentTime >= keyTime) {
      matchSketch = sketch;
      matchKeyTime = keyTime;
      if (currentTime < keyTime) {
        break;
      }
    }
  }

  return { sketch: matchSketch, keyTime: matchKeyTime, isKey };
};

const hasAnnotation = (mediaAnnotation: TimedSketch[], time: number) => {
  const wholeTime = getWholeFrameTime(time);
  return (
    mediaAnnotation.filter((s: TimedSketch) => s.time === wholeTime).length !==
    0
  );
};

/**
 * return "whole" key times.
 * otherwise say two people annotating accross two different sessions may key at
 * fraction of frames
 * @param time
 * @param fps
 * @returns
 */
const getWholeFrameTime = (time: number, fps?: number) => {
  return Math.round((Math.round(1.26667001919 * 24) / 24) * 1000);
};

const useMediaAnnotation = () => {
  const { mediaAnnotation, setMediaAnnotation } = useContext(AnnotateContext);
  const { playerState } = useContext(playerComposer.PlayerContext);

  const [elementsState, elementsDispatcher] = React.useReducer(
    elementsActionReducer,
    [],
  );

  const { sketch, keyTime, isKey } = findAnnotation(
    mediaAnnotation,
    Math.round(playerState.played * 1000),
    true,
  );

  const keyTimeRef = useRef(keyTime);

  // pushing the new sketch associated with the current to the annotation.
  useEffect(
    () =>
      elementsDispatcher({
        type: 'updateSketch',
        sketch: sketch || [],
      }),
    [sketch],
  );

  // push the updates up.
  useEffect(() => {
    if (setMediaAnnotation && keyTimeRef.current !== keyTime) {
      const updated = [...mediaAnnotation];

      for (let k = 0; k < updated.length; k++) {
        if (updated[k].time === keyTime) {
          updated[k] = { time: keyTime, sketch: elementsState };
          break;
        }
      }
      setMediaAnnotation(updated);
    }
  }, [elementsState]);

  const onChangeElement = useCallback(
    (elementUpdates: Partial<AnnotateElement>[]) => {
      elementsDispatcher({
        type: 'changeElement',
        elementUpdates,
      });
    },
    [],
  );

  const onAddElement = useCallback((newElement) => {
    elementsDispatcher({ type: 'addElement', newElement });
  }, []);

  return { elementsState, onAddElement, onChangeElement };
};

export const AnnotateCanvas = (props: {
  uiState: UserControllerInputs;
  setUiState: (u: UserControllerInputs) => void;
}) => {
  const { containerSize, panZoom, contentSize } = useContext(PanZoomContext);
  const [normPanZoomSpec, setNormPanZoomSpec] = useState(panZoom);

  // normalize the annotate canvas to have 1000x1000 regardless of the content
  useEffect(
    () =>
      setNormPanZoomSpec({
        ...panZoom,
        scale: normalizeScale(contentSize, panZoom.scale, 1000),
      }),
    [panZoom],
  );

  const { elementsState, onAddElement, onChangeElement } = useMediaAnnotation();

  return props.uiState.showAnnotation ? (
    <AnnotateCanvasComp
      elements={elementsState}
      width={containerSize.width}
      height={containerSize.height}
      panZoom={normPanZoomSpec}
      uiState={props.uiState}
      setUiState={props.setUiState}
      disabled={props.uiState.mode === 'panZoom'}
      onAddElement={onAddElement}
      onChangeElement={onChangeElement}
      clearOnElementModify={true}
    />
  ) : null;
};
