import { ElementsAction, AnnotateElement, TimedSketch } from './types';
import { findTimedSketch, getWholeFrameTime, getWholeMSecTime } from './utils';
import { v4 as uuidv4 } from 'uuid';

type TimedSketchAction =
  | ElementsAction
  | {
      type: 'addKey';
    }
  | {
      type: 'removeKey';
    }
  | {
      type: 'reload';
      timedSketches: TimedSketch[];
    }
  | {
      type: 'updateCurrentTime';
      time: number;
    }
  | {
      type: 'selectElements';
      selection: string[];
    };

type TimedSketchActionReducerState = {
  timedSketches: TimedSketch[]; // all the sketches across the media
  selection: string[]; // the selected element ids
  currentTimedSketch: TimedSketch | null; // the current sketch at the time
  currentTime: number; // the player time, note* this may not be the keytime
  keyTime: number | null; // convience, same as currentTimedSketch.time
  isKey: boolean; // convience, same as currentTime===crrentTimedSketch.time

  // *Note* currentTime (player time) may not be currentTimedSketch.time (key)
  // since the current sketch may be held for x seconds.
};

function addNewKey(
  timedSketches: TimedSketch[],
  currentTime: number,
  elements: AnnotateElement[] = [],
): { newSketch: TimedSketch; updated: TimedSketch[] } {
  const updated = [...timedSketches];
  const key = getWholeMSecTime(currentTime);
  const newSketch = {
    id: `sketch_${uuidv4()}`,
    time: key,
    sketch: elements,
  };
  updated.push(newSketch);
  updated.sort((a, b) => a.time - b.time);
  return { newSketch, updated };
}

export default function timedSketchActionReducer(
  state: TimedSketchActionReducerState,
  action: TimedSketchAction,
): TimedSketchActionReducerState {
  const currentSketch = state.currentTimedSketch?.sketch || [];
  const { timedSketches, currentTimedSketch, currentTime } = state;

  switch (action.type) {
    case 'reload':
      return { ...state, timedSketches: action.timedSketches };

    case 'addElement':
      if (!action.newElement.id) {
        throw Error(
          `Unexpected add element with no new id: ${action.newElement}`,
        );
      }
      if (state.isKey) {
        currentSketch.push(action.newElement);
        return state;
      } else {
        const newKey = addNewKey(timedSketches, currentTime, [
          action.newElement,
        ])
        return {
          ...state,
          timedSketches: newKey.updated,
          isKey: true,
          keyTime: newKey.newSketch.time,
        };
      }

    case 'removeElements':
      currentTimedSketch!.sketch = currentSketch.filter(
        (x) => !action.ids.includes(x.id),
      );

      return { ...state, timedSketches: [...timedSketches] };

    case 'selectElements':
      return {
        ...state,
        selection: action.selection,
      };

    case 'changeElement':
      const elementIndexById = currentSketch.reduce(
        (a: { [id: string]: number }, v, i) => {
          a[v.id] = i;
          return a;
        },
        {},
      );

      action.elementUpdates.forEach((updates) => {
        const index = elementIndexById[updates.id!];
        Object.keys(updates).forEach(
          (k) => (currentSketch[index][k] = updates[k]),
        );
      });
      return state;

    case 'updateCurrentTime':
      const { timedSketch, isKey } = findTimedSketch(
        state.timedSketches,
        getWholeMSecTime(action.time),
        false,
      );

      const keyTime = isKey ? timedSketch!.time : null;

      return {
        ...state,
        currentTimedSketch: timedSketch,
        currentTime: action.time,
        keyTime,
        isKey,
      };

    case 'addKey':
      const addNewKeyResult = addNewKey(timedSketches, currentTime);
      return {
        ...state,
        timedSketches: addNewKeyResult.updated,
        isKey: true,
        keyTime: addNewKeyResult.newSketch.time,
      };

    case 'removeKey':
      return {
        ...state,
        timedSketches: state.timedSketches.filter(
          (x) => x.id !== state.currentTimedSketch?.id,
        ),
      };

    default:
      return state;
  }
}
