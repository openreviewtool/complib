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
import BrushTools from './UI/BrushTools';
import EditTools from './UI/EditTools';

interface AnnotateContextInteface {
  mediaAnnotation: TimedSketch[];
  setMediaAnnotation?: (s: TimedSketch[]) => void;
  annotateTimeList?: number[];
  holdKey?: boolean;
  setHoldKey?: () => void;

  isKey: boolean;
  setIsKey: (v: boolean) => void;

  onAddKey?: () => void;
  onRemoveKey?: () => void;
}

export const AnnotateContext = React.createContext<AnnotateContextInteface>({
  mediaAnnotation: [],
  isKey: false,
  setIsKey: () => {},
});

export const AnnotateContextProvider: React.FC<{
  value: Partial<AnnotateContextInteface>;
}> = ({
  value: { mediaAnnotation = [], setMediaAnnotation = () => {} },
  ...props
}) => {
  const { playerState } = useContext(playerComposer.PlayerContext);
  const [annotateTimeList, setAnnotateTimeList] = useState<number[]>([]);
  const [isKey, setIsKey] = useState<boolean>(false);

  useEffect(() => {
    setAnnotateTimeList(mediaAnnotation.map((m) => m.time / 1000));
  }, [mediaAnnotation]);

  const onAddKey = () => {
    console.log(
      'ToDo:',
      playerState.played,
      getWholeFrameTime(playerState.played),
    );
  };

  const onRemoveKey = () => {
    console.log(
      '...add key at',
      playerState.played,
      getWholeFrameTime(playerState.played),
    );
  };


  return (
    <AnnotateContext.Provider
      value={{
        mediaAnnotation,
        setMediaAnnotation,
        annotateTimeList,
        isKey,
        setIsKey,
        onAddKey,
        onRemoveKey,
      }}
    >
      {props.children}
    </AnnotateContext.Provider>
  );
};

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
  hold = hold === undefined ? false : hold;
  fps = fps || 24;

  const frameDurationInMSec = 500; //(12 / fps) * 1000;

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

export const findNextKeyTime = (
  keyList: number[],
  currentTime: number,
): number | null => {
  const adjKeys = keyList.filter((t) => currentTime < t);

  if (adjKeys.length === 0) {
    if (keyList.length === 0) {
      return null;
    } else {
      return keyList[0];
    }
  } else {
    return adjKeys[0];
  }
};

export const findPrevKeyTime = (keyList: number[], currentTime: number) => {
  const adjKeys = keyList.filter((t) => t < currentTime);

  if (adjKeys.length === 0) {
    if (keyList.length === 0) {
      return null;
    } else {
      return keyList[keyList.length - 1];
    }
  } else {
    return adjKeys[adjKeys.length - 1];
  }
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
  fps = fps || 24;
  return Math.round((Math.round(time * fps) / fps) * 1000);
};

const useMediaAnnotation = () => {
  const { mediaAnnotation, setMediaAnnotation, setIsKey } =
    useContext(AnnotateContext);
  const { playerState } = useContext(playerComposer.PlayerContext);

  const [elementsState, elementsDispatcher] = React.useReducer(
    elementsActionReducer,
    [],
  );

  const { sketch, keyTime, isKey } = findAnnotation(
    mediaAnnotation,
    Math.round(playerState.played * 1000),
    false,
  );

  const keyTimeRef = useRef<number | null>(null);

  // pushing the new sketch associated with the current to the annotation.
  useEffect(() => {
    if (keyTimeRef.current !== keyTime) {
      keyTimeRef.current = keyTime;
      elementsDispatcher({
        type: 'updateSketch',
        sketch: sketch || [],
      });
    }
  }, [sketch]);

  useEffect(() => setIsKey(isKey), [isKey]);

  // push the updates up.
  useEffect(() => {
    if (setMediaAnnotation) {
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

  const onAddElement = (newElement: AnnotateElement) => {
    if (isKey) {
      elementsDispatcher({ type: 'addElement', newElement });
    } else {
      const updated = [...mediaAnnotation];
      const key = getWholeFrameTime(playerState.played);
      updated.push({ time: key, sketch: [newElement] });
      updated.sort((a, b) => a.time - b.time);
      if (setMediaAnnotation) setMediaAnnotation(updated);
    }
  };

  return { elementsState, onAddElement, onChangeElement };
};

export const AnnotateCanvas = (props: {
  uiState: UserControllerInputs;
  setUiState: (u: UserControllerInputs) => void;
}) => {
  const { containerSize, panZoom, contentSize } = useContext(PanZoomContext);
  const [normPanZoomSpec, setNormPanZoomSpec] = useState(panZoom);
  const [selection, setSelection] = useState<string[]>([]);

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
  // auto select newly created shape (except path).
  const onAddElementHelper = (elm: AnnotateElement) => {
    onAddElement(elm);
    if (elm.etype!=='Path') {
      props.setUiState({ ...props.uiState, mode: 'selection' });
      window.setTimeout( setSelection, 100, [elm.id]);
    }
  };

  return props.uiState.showAnnotation ? (
    <AnnotateCanvasComp
      elements={elementsState}
      selection={selection}
      onSelection={setSelection}
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
  const { isKey, onRemoveKey } = useContext(AnnotateContext);
  return (
    <>
      <BrushTools uiState={props.uiState} setUIState={props.setUiState} />
      <EditTools
        uiState={props.uiState}
        setUIState={props.setUiState}
        // onAddKey={onAddKey}
        // disableAddKey={isKey}
        onRemoveKey={onRemoveKey}
        disableRemoveKey={!isKey}
      />
    </>
  );
};
