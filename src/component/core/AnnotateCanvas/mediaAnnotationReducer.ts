import { ElementsAction, AnnotateElement, TimedSketch } from './types';

/**
 * The reducers captures all the element events, with the aim to sync to another user.
 * @param state All the elements on the canvas
 * @param action The action.
 * @returns Updated set of elements on the canvas
 */
export default function mediaAnnotationReducer(
  state: {
    sketchList: TimedSketch[];
    currentTime: number;
    keyTime: number;
    isKey: boolean;
  },
  action: ElementsAction,
) {
  // const elementIndexById = state.reduce((a: { [id: string]: number }, v, i) => {
  //   a[v.id] = i;
  //   return a;
  // }, {});

  // const updatedElements = [...state];

  // switch (action.type) {
  //   case 'addElement':
  //     if (!action.newElement.id) {
  //       throw Error(
  //         `Unexpected add element with no new id: ${action.newElement}`,
  //       );
  //     }
  //     return [...state, action.newElement];

  //   case 'changeElement':
  //     action.elementUpdates.forEach((updates)=>{
  //       const index = elementIndexById[updates.id!]
  //       updatedElements[index] = {...updatedElements[index], ...updates}
  //     })

  //     return updatedElements

  //   case 'removeElement':
  //     // ToDo: update this now that there is a elemetIndexById look up.
  //     const removeIndex = state.reduce((a, c, index) => {
  //       if (action.removeIds.indexOf(c.id) !== -1) {
  //         a.push(index);
  //       }
  //       return a;
  //     }, [] as number[]);

  //     removeIndex.reverse().forEach((removeIndex) => {
  //       updatedElements.splice(removeIndex, 1);
  //     });

  //     return updatedElements;

  //   case 'updateSketch':
  //     return action.sketch;
  // }
}
