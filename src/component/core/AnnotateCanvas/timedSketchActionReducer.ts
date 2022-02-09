import { ElementsAction, AnnotateElement, TimedSketch } from './types';
import { findTimedSketch, getWholeFrameTime } from './utils';
import { v4 as uuidv4 } from 'uuid';

type TimedSketchAction =
  | ElementsAction
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
  timedSketches: TimedSketch[];
  currentTimedSketch: TimedSketch | null;
  currentTime: number;
  keyTime?: number | null;
  isKey: boolean;
  selection: string[];
};

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
        const updated = [...state.timedSketches];
        const key = getWholeFrameTime(state.currentTime);
        updated.push({
          id: `sketch_${uuidv4()}`,
          time: key,
          sketch: [action.newElement],
        });
        updated.sort((a, b) => a.time - b.time);
        return {
          ...state,
          timedSketches: updated,
          isKey: true,
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
        Math.round(action.time * 1000),
        false,
      );

      return {
        ...state,
        currentTimedSketch: timedSketch,
        currentTime: action.time,
        isKey,
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
