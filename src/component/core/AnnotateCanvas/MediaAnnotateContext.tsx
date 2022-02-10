import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import { AnnotateElement, TimedSketch } from './types';
import timedSketchActionReducer from './timedSketchActionReducer';
import { PlayerContext } from '../MediaPlayer/PlayerContext';
import { formatTimeDisplay } from '../Timeline/util';

interface MediaAnnotateContextInteface {
  annotateTimeList: number[];

  elements: AnnotateElement[];
  onAddElement: (e: AnnotateElement) => void;
  onChangeElement: (e: Partial<AnnotateElement>[]) => void;
  onRemoveElements: (el: string[]) => void;

  isKey: boolean;
  keyTime: number|null;
  onAddKey: () => void;
  onRemoveKey: () => void;

  selection: string[];
  onSelection: (s: string[]) => void;
}

export const MediaAnnotateContext =
  React.createContext<MediaAnnotateContextInteface>({
    annotateTimeList: [],

    elements: [],
    onAddElement: () => {},
    onChangeElement: () => {},
    onRemoveElements: () => {},

    isKey: false,
    keyTime: null,
    onAddKey: () => {},
    onRemoveKey: () => {},

    selection: [],
    onSelection: () => {},
  });

export const MediaAnnotationContextProvider: React.FC<{
  mediaAnnotation: TimedSketch[];
  setMediaAnnotation: (t: TimedSketch[]) => void;
}> = ({ mediaAnnotation, setMediaAnnotation, children }) => {
  const { playerState } = useContext(PlayerContext);

  const [annotateTimeList, setAnnotateTimeList] = useState<number[]>([]);

  const [mediaAnnotationState, mediaAnnotationDispatch] = useReducer(
    timedSketchActionReducer,
    {
      timedSketches: mediaAnnotation,
      currentTimedSketch: null,
      currentTime: -1,
      isKey: false,
      keyTime: null,
      selection: [],
    },
  );

  useEffect(() => {
    mediaAnnotationDispatch({
      type: 'reload',
      timedSketches: mediaAnnotation,
    });
  }, [mediaAnnotation]);

  useEffect(() => {
    // push the changes up
    setMediaAnnotation(mediaAnnotationState.timedSketches);

    // now refresh the annotations.
    mediaAnnotationDispatch({
      type: 'updateCurrentTime',
      time: playerState.played,
    });
  }, [mediaAnnotationState.timedSketches]);

  useEffect(() => {
    const markers = mediaAnnotationState.timedSketches
      // convert millisec back to sec
      .map((m) => m.time / 1000)
      // prevent faulty markers
      .filter((m) => m <= playerState.duration && m >= 0);

    setAnnotateTimeList(markers);
  }, [mediaAnnotationState.timedSketches, playerState.duration]);

  useEffect(() => {
    mediaAnnotationDispatch({
      type: 'updateCurrentTime',
      time: playerState.played,
    });
  }, [playerState.played]);

  const onAddElement = useCallback(
    (newElement) => mediaAnnotationDispatch({ type: 'addElement', newElement }),
    [],
  );

  const onChangeElement = useCallback(
    (elementUpdates) =>
      mediaAnnotationDispatch({ type: 'changeElement', elementUpdates }),
    [],
  );

  const onAddKey = useCallback(() => {
    mediaAnnotationDispatch({ type: 'addKey' });
  }, []);

  const onRemoveKey = useCallback(() => {
    if (
      confirm(
        `Remove annotations at time: ${formatTimeDisplay(
          playerState.played,
          playerState.duration,
        )}?`,
      )
    ) {
      mediaAnnotationDispatch({ type: 'removeKey' });
    }
  }, [playerState]);

  const onSelection = useCallback(
    (selection) =>
      mediaAnnotationDispatch({ type: 'selectElements', selection }),
    [],
  );

  const onRemoveElements = useCallback(
    (ids) => mediaAnnotationDispatch({ type: 'removeElements', ids }),
    [],
  );

  return (
    <MediaAnnotateContext.Provider
      value={{
        annotateTimeList,

        elements: mediaAnnotationState.currentTimedSketch?.sketch || [],
        onAddElement,
        onChangeElement,
        onRemoveElements,

        isKey: mediaAnnotationState.isKey,
        keyTime: mediaAnnotationState.keyTime,
        onAddKey,
        onRemoveKey,

        selection: mediaAnnotationState.selection,
        onSelection,
      }}
    >
      {children}
    </MediaAnnotateContext.Provider>
  );
};
